// services/api/http.ts

import axios, { AxiosRequestConfig } from 'axios'
import { apiBaseUrl } from '../constants'
import {
	clearToken,
	getToken,
	saveToken,
	isTokenExpiredOrExpiringSoon,
	isLoggedOut,
	setLoggedOut,
} from '../'
import { refreshTokenRequest } from '.'

// -- In-memory token cache --
let cachedToken: string | null = null
export const getCachedToken = async () => {
	if (cachedToken) return cachedToken
	cachedToken = await getToken()
	return cachedToken
}
export const saveCachedToken = async (token: string) => {
	await saveToken(token)
	cachedToken = token
}

// -- Global logout flag --
// let isLoggedOut = false

// -- Unauthorized handler --
let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (handler: () => void) => {
	onUnauthorized = handler
}

// -- Axios instance --
export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
})

// -- Auth header utilities --
export const setAuthHeader = (token: string) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`
	setLoggedOut(false)
}
export const clearAuthHeader = () => {
	delete api.defaults.headers.common['Authorization']
}

// -- Token refresh queueing --
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
	refreshSubscribers.push(cb)
}

const onTokenRefreshed = (token: string) => {
	refreshSubscribers.forEach(cb => cb(token))
	refreshSubscribers = []
}

const handleUnauthorized = async () => {
	setLoggedOut(true)
	await clearToken()
	clearAuthHeader()
	if (onUnauthorized) onUnauthorized()
}

// -- Request interceptor --
api.interceptors.request.use(
	async (config) => {
		if (isLoggedOut) return config

		let token = await getCachedToken()
		if (!token) return config

		if (!isTokenExpiredOrExpiringSoon(token)) {
			config.headers = config.headers || {}
			config.headers['Authorization'] = `Bearer ${token}`
			return config
		}

		if (!isRefreshing) {
			isRefreshing = true
			try {
				const { accessToken } = await refreshTokenRequest()
				await saveCachedToken(accessToken)
				onTokenRefreshed(accessToken)
				token = accessToken
			} catch (err) {
				refreshSubscribers = []
				await handleUnauthorized()
				return Promise.reject(err)
			} finally {
				isRefreshing = false
			}
		} else {
			await new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => reject(new Error('Token refresh timeout')), 5000)
				subscribeTokenRefresh((newToken) => {
					clearTimeout(timeout)
					token = newToken
					resolve()
				})
			})
		}

		config.headers = config.headers || {}
		config.headers['Authorization'] = `Bearer ${token}`
		return config
	},
	error => Promise.reject(error)
)

// -- Extend Axios config to support _retry --
interface RetryableRequest extends AxiosRequestConfig {
	_retry?: boolean
}

// -- Response interceptor (401 handling) --
api.interceptors.response.use(
	response => response,
	async (error) => {
		const originalRequest = error.config as RetryableRequest

		if (!originalRequest || typeof originalRequest !== 'object') {
			return Promise.reject(error)
		}

		const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh-token')

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isLoggedOut &&
			!isRefreshEndpoint
		) {
			originalRequest._retry = true

			if (!isRefreshing) {
				isRefreshing = true
				try {
					const { accessToken } = await refreshTokenRequest()
					await saveCachedToken(accessToken)
					onTokenRefreshed(accessToken)
					originalRequest.headers = {
						...originalRequest.headers,
						Authorization: `Bearer ${accessToken}`,
					}
					return api(originalRequest)
				} catch (refreshError) {
					refreshSubscribers = []
					await handleUnauthorized()
					return Promise.reject(refreshError)
				} finally {
					isRefreshing = false
				}
			}

			return new Promise((resolve, reject) => {
				subscribeTokenRefresh((newToken: string) => {
					originalRequest.headers = {
						...originalRequest.headers,
						Authorization: `Bearer ${newToken}`,
					}
					resolve(api(originalRequest))
				})
			})
		}

		return Promise.reject(error)
	}
)

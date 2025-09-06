// packages/services/src/api/http.ts

import axios, { AxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'
import { apiBaseUrl } from '../constants'
import { tokenStorage } from '../auth'
import { refreshAccessToken } from '.'

// -- In-memory token cache (native only) --
let cachedToken: string | null = null
export const getCachedToken = async () => {
	if (cachedToken) return cachedToken
	cachedToken = await tokenStorage.getAccessToken()
	return cachedToken
}
export const saveCachedToken = async (token: string) => {
	await tokenStorage.save(token)
	cachedToken = token
}

// -- Global logout flag and unauthorized handler --
let isLoggedOut = false
let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (handler: () => void) => {
	onUnauthorized = handler
}

// -- Axios instance --
export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
})

// -- Token refresh queueing --
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => refreshSubscribers.push(cb)
const onTokenRefreshed = (token: string) => {
	refreshSubscribers.forEach(cb => cb(token))
	refreshSubscribers = []
}

const handleUnauthorized = async () => {
	isLoggedOut = true
	await tokenStorage.clear()
	if (onUnauthorized) onUnauthorized()
}

// -- Request interceptor --
api.interceptors.request.use(async (config) => {
	// Web - cookies handle auth automatically
	if (Platform.OS === 'web' || isLoggedOut) return config

	let token = await getCachedToken()
	if (!token) return config

	config.headers = config.headers || {}
	config.headers['Authorization'] = `Bearer ${token}`
	return config
}, error => Promise.reject(error))

// -- Response interceptor (401 handling & refresh queue) --
interface RetryableRequest extends AxiosRequestConfig { _retry?: boolean }

api.interceptors.response.use(
	response => response,
	async (error) => {
		const originalRequest = error.config as RetryableRequest
		if (!originalRequest || typeof originalRequest !== 'object') return Promise.reject(error)

		const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh')

		// Native - refresh token on 401
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isLoggedOut &&
			!isRefreshEndpoint &&
			Platform.OS !== 'web'
		) {
			originalRequest._retry = true

			if (!isRefreshing) {
				isRefreshing = true
				try {
					const newToken = await refreshAccessToken()
					if (!newToken) throw new Error('Unable to refresh token')
					await saveCachedToken(newToken)
					onTokenRefreshed(newToken)

					originalRequest.headers = {
						...originalRequest.headers,
						Authorization: `Bearer ${newToken}`,
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

			// Queue pending requests while refreshing
			return new Promise((resolve, reject) => {
				const timeout = setTimeout(() => reject(new Error('Token refresh timeout')), 5000)
				subscribeTokenRefresh((newToken: string) => {
					clearTimeout(timeout)
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

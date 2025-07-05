// services/api/http.ts

import axios from 'axios'
import { apiBaseUrl } from '../constants'
import { clearToken, getToken, isTokenExpiredOrExpiringSoon, saveToken } from '../'
import { logoutRequest, refreshTokenRequest } from '.'

let onUnauthorized: (() => void) | null = null

export const setUnauthorizedHandler = (handler: () => void) => {
	onUnauthorized = handler
}

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
})

// Set auth header
export const setAuthHeader = (token: string) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Clear auth header
export const clearAuthHeader = () => {
	delete api.defaults.headers.common['Authorization']
}

// Token refresh queueing logic
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
	refreshSubscribers.push(cb)
}

function onTokenRefreshed(token: string) {
	refreshSubscribers.forEach(cb => cb(token))
	refreshSubscribers = []
}

api.interceptors.request.use(
	async (config) => {
		let token = await getToken()

		if (!token) return config

		if (isTokenExpiredOrExpiringSoon(token)) {
			if (!isRefreshing) {
				isRefreshing = true
				try {
					const { accessToken } = await refreshTokenRequest()
					await saveToken(accessToken)
					setAuthHeader(accessToken)
					onTokenRefreshed(accessToken)
					token = accessToken
				} catch (err) {
					refreshSubscribers = []
					await clearToken()
					clearAuthHeader()
					await logoutRequest()
					if (onUnauthorized) onUnauthorized()
					return Promise.reject(err)
				} finally {
					isRefreshing = false
				}
			} else {
				await new Promise<void>((resolve, reject) => {
					const timeout = setTimeout(() => {
						reject(new Error('Token refresh timeout'))
					}, 5000)

					subscribeTokenRefresh((newToken) => {
						clearTimeout(timeout)
						token = newToken
						resolve()
					})
				})
			}
		}

		config.headers = config.headers || {}
		config.headers['Authorization'] = `Bearer ${token}`

		return config
	},
	(error) => Promise.reject(error)
)

// Auto-refresh token on 401 responses
api.interceptors.response.use(
	response => response,
	async (error) => {
		const originalRequest = error?.config
		if (!originalRequest || typeof originalRequest !== 'object') {
			return Promise.reject(error)
		}

		const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh-token')
		const isRetryAttempt = originalRequest._retry

		if (error.response?.status === 401 && !isRetryAttempt && !isRefreshEndpoint) {
			originalRequest._retry = true

			if (!isRefreshing) {
				isRefreshing = true
				try {
					const { accessToken } = await refreshTokenRequest()
					await saveToken(accessToken)
					setAuthHeader(accessToken)
					isRefreshing = false
					onTokenRefreshed(accessToken)

					originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
					return api(originalRequest)
				} catch (refreshError) {
					isRefreshing = false
					refreshSubscribers = []
					await clearToken()
					clearAuthHeader()
                    console.log('logoutRequest (res)')
					await logoutRequest()
					if (onUnauthorized) onUnauthorized()
					return Promise.reject(refreshError)
				}
			}

			return new Promise((resolve, reject) => {
				subscribeTokenRefresh((token: string) => {
					originalRequest.headers['Authorization'] = `Bearer ${token}`
					resolve(api(originalRequest))
				})
			})
		}

		return Promise.reject(error)
	}
)

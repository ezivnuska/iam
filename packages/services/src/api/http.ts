// services/api/http.ts

import axios from 'axios'
import { apiBaseUrl } from '../constants'
import { getToken, saveToken, clearToken } from '../'
import { logoutRequest, refreshTokenRequest } from '.'

console.log(apiBaseUrl)

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true, // Send cookies if needed
})

// Set auth header
export const setAuthHeader = (token: string) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Clear auth header
export const clearAuthHeader = () => {
	delete api.defaults.headers.common['Authorization']
}

// --- Token Refresh Queueing Logic ---
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
	refreshSubscribers.push(cb)
}

function onTokenRefreshed(token: string) {
	refreshSubscribers.forEach(cb => cb(token))
	refreshSubscribers = []
}

// Attach token automatically before every request
api.interceptors.request.use(
	async (config) => {
		const token = await getToken()
		if (token) {
			config.headers = config.headers || {}
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

// Auto-refresh token on 401 responses
api.interceptors.response.use(
	response => response,
	async (error) => {
		const originalRequest = error.config
		const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh-token')
		const isRetryAttempt = originalRequest._retry

		// Handle 401 errors only if not retrying or on refresh endpoint
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

					// Retry original request
					originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
					return api(originalRequest)
				} catch (refreshError) {
					isRefreshing = false
					refreshSubscribers = []
					await clearToken()
					clearAuthHeader()
					await logoutRequest()
					return Promise.reject(refreshError)
				}
			}

			// If already refreshing, queue this request
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
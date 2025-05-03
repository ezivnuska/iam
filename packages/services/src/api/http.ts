// services/api/http.ts

import axios from 'axios'
import { apiBaseUrl } from '../constants'
import { getToken, saveToken, clearToken } from '../'
import { logoutRequest, refreshTokenRequest } from '.'

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,  // Ensure that cookies are sent with requests
})

// Set auth header
export const setAuthHeader = (token: string) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Clear auth header
export const clearAuthHeader = () => {
	delete api.defaults.headers.common['Authorization']
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
	
		// Handle 401 errors when the refresh token fails
		if (error.response?.status === 401 && !isRetryAttempt && !isRefreshEndpoint) {
			originalRequest._retry = true
	
			try {
				// Try to refresh the access token
				const { accessToken } = await refreshTokenRequest()
	
				// If refresh token is successful, save the new access token
				await saveToken(accessToken)
				setAuthHeader(accessToken)
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
	
				// Retry the original request with the new access token
				return api(originalRequest)
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError)
				await clearToken()
				clearAuthHeader()
	
				// If the refresh token is invalid/expired, force the user to log in again
				if (!isRefreshEndpoint) {
					console.error('Token refresh failed:', refreshError)
					await clearToken()
					await logoutRequest()
				}
	
				// Reject the error and prevent further retries
				return Promise.reject(refreshError)
			}
		}
	
		return Promise.reject(error)
	}
)
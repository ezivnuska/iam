// services/api/http.ts

import axios from 'axios'
import { apiBaseUrl } from '../constants'
import { getToken, saveToken, clearToken } from '../tokenStorage'
import { logoutRequest, refreshTokenRequest } from '.'

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
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		// Prevent infinite loops
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				const { accessToken } = await refreshTokenRequest()

				await saveToken(accessToken)
				setAuthHeader(accessToken) // Set globally
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}` // Set for retry

				return api(originalRequest) // Retry original request
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError)
				await clearToken()
				await logoutRequest()

				// You should navigate to login screen cleanly
				if (typeof window !== 'undefined') {
					window.location.reload() // Web fallback
				}
				// or trigger navigation programmatically if you're in React Native
			}
		}

		return Promise.reject(error)
	}
)
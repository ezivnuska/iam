// services/api/http.ts

import axios from 'axios'
import { apiBaseUrl } from '../constants'
import { getToken, saveToken } from '../tokenStorage'
import { logoutRequest, refreshTokenRequest } from '.'

const TOKEN_KEY = 'access_token'

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
})

// Attach token on every request
api.interceptors.request.use(async config => {
	const token = await getToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}, (error) => {
	return Promise.reject(error)
})

// Handle 401 globally
api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const { accessToken } = await refreshTokenRequest()
          await saveToken(accessToken)
  
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
  
          return api(originalRequest)
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError)
          await logoutRequest()
          window.location.reload() // or navigate to Signin
        }
      }
  
      return Promise.reject(error)
    }
  )
// Handle 401 errors (expired token) and auto-refresh
// api.interceptors.response.use((response) => {
// 	return response
// }, async (error) => {
// 	const originalRequest = error.config

// 	if (error.response?.status === 401 && !originalRequest._retry) {
// 		originalRequest._retry = true

// 		try {
// 			const accessToken = await refreshAccessToken()

// 			await saveToken(accessToken)

// 			// Update Authorization header and retry original request
// 			originalRequest.headers.Authorization = `Bearer ${accessToken}`
// 			return api(originalRequest)

// 		} catch (refreshError) {
// 			console.error('Refresh token failed:', refreshError)
// 			await logoutRequest()
// 			return Promise.reject(refreshError)
// 		}
// 	}

// 	return Promise.reject(error)
// })
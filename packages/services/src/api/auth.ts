// packages/services/src/api/auth.ts

import { api, clearToken, clearAuthHeader, rawApi } from '../'

export const logoutRequest = async () => {
    console.log('LOGOUT REQUEST')
	try {
		// Call the backend to clear the refresh token cookie
		await rawApi.post('logout')

		// Clear token on the frontend (AsyncStorage)
		await clearToken()
		clearAuthHeader()
	} catch (error) {
		console.error('Logout failed:', error)
	}
}

type RefreshTokenResponse = { accessToken: string }

export const signinRequest = async (email: string, password: string) => {
	return await api.post('/auth/signin', { email, password }).then(res => res.data)
}
export const signupRequest = (email: string, username: string, password: string) =>
	api.post('/auth/signup', { email, username, password }).then(res => res.data)

export const refreshTokenRequest = async (): Promise<RefreshTokenResponse> => {
	console.log('[Auth] Sending refresh-token request...')
	const response = await api.post<RefreshTokenResponse>('/auth/refresh-token')
	console.log('[Auth] Got new token:', response.data.accessToken)
	return response.data
}

export const resetPassword = (token: string, newPassword: string) =>
	api.post('/auth/reset-password', { token, newPassword }).then(res => res.data)
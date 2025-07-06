// packages/services/src/api/auth.ts

import { api, rawApi } from '../'
import type { User } from '@iam/types'

export const logoutRequest = async () => {
    console.log('LOGOUT')
    try {
        await rawApi.post('/auth/logout')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}

type RefreshTokenResponse = { accessToken: string, user: User }

export const signinRequest = async (email: string, password: string) => {
	return await api.post('/auth/signin', { email, password }).then(res => res.data)
}
export const signupRequest = (email: string, username: string, password: string) =>
	api.post('/auth/signup', { email, username, password }).then(res => res.data)

export const refreshTokenRequest = async (): Promise<RefreshTokenResponse> => {
	console.log('[Auth] Sending refresh-token request...')
	const response = await rawApi.post<RefreshTokenResponse>('/auth/refresh-token')
	console.log('[Auth] refreshTokenResponse:', response.data)
	console.log('[Auth] Got new token:', response.data.accessToken)
	return response.data
}

export const resetPassword = (token: string, newPassword: string) =>
	api.post('/auth/reset-password', { token, newPassword }).then(res => res.data)
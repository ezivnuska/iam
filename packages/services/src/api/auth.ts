// packages/services/src/api/auth.ts

import { api } from '.'
import { saveToken } from '../tokenStorage'

type RefreshTokenResponse = { accessToken: string }

export const signinRequest = (email: string, password: string) =>
	api.post('/auth/signin', { email, password }).then(res => res.data)

export const signupRequest = (email: string, username: string, password: string) =>
	api.post('/auth/signup', { email, username, password }).then(res => res.data)

export const refreshTokenRequest = async (): Promise<RefreshTokenResponse> => {
	const response = await api.post<RefreshTokenResponse>('/auth/refresh-token')
	return response.data
}

export const logoutRequest = async () => {
	const response = await api.post('/auth/logout')
    return response.data
}

/**
 * Signin with a provided token
 * - Save the token locally
 * - Set it on axios
 * - Verify by fetching user profile
 */
export async function signinWithToken(token: string): Promise<void> {
	await saveToken(token)

	console.log('signinWithToken: Saved token:', token)
	api.defaults.headers.common.Authorization = `Bearer ${token}`

	try {
		await api.get('/profile')
	} catch (error) {
		console.error('signinWithToken: Token validation failed', error)
		throw error // or maybe handle it differently
	}
}
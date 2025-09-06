// packages/services/src/api/auth.ts

import { Platform } from 'react-native'
import { api } from '../'
import { tokenStorage } from '../auth'

// ---------------- LOGOUT ----------------
export const logoutRequest = async () => {
	try {
		const config = Platform.OS === 'web' ? { withCredentials: true } : {}
		await api.post('/auth/logout', {}, config)
	} catch (err) {
		console.error('Logout failed:', err)
	}
}

// ---------------- SIGNIN ----------------
export const signinRequest = async (email: string, password: string) => {
	const config = Platform.OS === 'web' ? { withCredentials: true } : {}
	const res = await api.post(
		'/auth/signin',
		{ email, password, clientType: Platform.OS },
		config
	)
	return res.data
}

// ---------------- SIGNUP ----------------
export const signupRequest = async (
	email: string,
	username: string,
	password: string
) => {
	const config = Platform.OS === 'web' ? { withCredentials: true } : {}
	const res = await api.post(
		'/auth/signup',
		{ email, username, password, clientType: Platform.OS },
		config
	)
	return res.data
}

// ---------------- REFRESH ----------------
export const refreshAccessToken = async (): Promise<string | null> => {
	if (Platform.OS === 'web') {
		// Web: backend handles rotation via HttpOnly cookie
		await api.post('/auth/refresh-token', {}, { withCredentials: true })
		return null
	} else {
		// Native: use refreshToken stored in secure storage
		const refreshToken = await tokenStorage.getRefreshToken()
		if (!refreshToken) return null

		const res = await api.post('/auth/refresh-token', { refreshToken })
		const { accessToken } = res.data
		if (accessToken) {
			await tokenStorage.save(accessToken, refreshToken)
		}
		return accessToken
	}
}

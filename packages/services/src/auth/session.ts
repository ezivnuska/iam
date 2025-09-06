// packages/services/src/auth/session.ts

import { Platform } from 'react-native'
import { tokenStorage } from './tokenStorage'
import { isTokenExpiredOrExpiringSoon } from '../'
import { getProfile, refreshAccessToken } from '../api'
import { isLoggedOut, setLoggedOut } from './'
import type { AuthResponseType } from '@iam/types'

// Conditionally import header helpers for native only
let setAuthHeaderFn: (token: string) => void = () => {}
let clearAuthHeaderFn: () => void = () => {}

if (Platform.OS !== 'web') {
	const apiHeaders = require('../api/authHeaders')
	setAuthHeaderFn = apiHeaders.setAuthHeader
	clearAuthHeaderFn = apiHeaders.clearAuthHeader
}

export const trySigninFromStoredToken = async (): Promise<AuthResponseType | null> => {
	if (isLoggedOut) {
		console.warn('[auth] Aborting session restore: already logged out')
		return null
	}

	try {
		const token = Platform.OS !== 'web' ? await tokenStorage.getAccessToken() : null

		if (!token && Platform.OS !== 'web') {
			console.warn('[auth] No token found in secure storage')
			return null
		}

		// Token exists but may be expired - attempt refresh
		if (token && isTokenExpiredOrExpiringSoon(token)) {
			try {
				// Refresh token (web uses cookies, native uses stored refreshToken)
				const newToken = await refreshAccessToken()

				if (!newToken) {
					throw new Error('Unable to refresh token')
				}

				if (Platform.OS !== 'web') {
					await tokenStorage.save(newToken) // only accessToken
					setAuthHeaderFn(newToken)
				}

				const user = await getProfile()
				setLoggedOut(false)

				return { accessToken: newToken, user, refreshToken: undefined }
			} catch (err) {
				console.warn('[auth] Refresh token failed:', err)
				if (Platform.OS !== 'web') {
					await tokenStorage.clear()
					clearAuthHeaderFn()
				}
				setLoggedOut(true)
				return null
			}
		}

		// Token is valid - restore session
		if (token && Platform.OS !== 'web') setAuthHeaderFn(token)
		const profile = await getProfile()
		console.info('[auth] Session restored from token:', profile.username)
		setLoggedOut(false)

		return { accessToken: token || '', user: profile, refreshToken: undefined }
	} catch (err: any) {
		console.warn('[auth] Failed to restore session from token', err)
		if (Platform.OS !== 'web') {
			await tokenStorage.clear()
			clearAuthHeaderFn()
		}
		setLoggedOut(true)
		return null
	}
}

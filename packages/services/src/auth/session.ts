// packages/services/src/auth/session.ts

import { getToken, clearToken, saveToken } from './tokenStorage'
import { isTokenExpiredOrExpiringSoon } from '../'
import {
	setAuthHeader,
	clearAuthHeader,
	getProfile,
	refreshTokenRequest,
} from '../api'
import { isLoggedOut, setLoggedOut } from './'
import type { AuthResponseType } from '@iam/types'

export const trySigninFromStoredToken = async (): Promise<AuthResponseType | null> => {
	if (isLoggedOut) {
		console.warn('[auth] Aborting session restore: already logged out')
		return null
	}

	try {
		const token = await getToken()
		if (!token) {
			console.warn('[auth] No token found in storage')
			return null
		}

		if (isTokenExpiredOrExpiringSoon(token)) {
			console.info('[auth] Token is expired or expiring soon, attempting refresh...')
			try {
				const authResponse = await refreshTokenRequest()
				setLoggedOut(false)
				return authResponse
			} catch (err) {
				console.warn('[auth] Refresh token failed:', err)
				await clearToken()
				clearAuthHeader()
				setLoggedOut(true)
				return null
			}
		}

		setAuthHeader(token)
		const profile = await getProfile()
		console.info('[auth] Session restored from token:', profile.username)
		setLoggedOut(false)
		return { accessToken: token, user: profile}
	} catch (err: any) {
		console.warn('[auth] Failed to restore session from token')

		if (err?.response?.status === 401) {
			console.warn('[auth] Token unauthorized (401) — clearing...')
		} else if (err?.message?.includes?.('Network')) {
			console.warn('[auth] Network issue — possibly offline')
		} else {
			console.error('[auth] Unexpected error:', err)
		}

		await clearToken()
		clearAuthHeader()
		setLoggedOut(true)
		return null
	}
}

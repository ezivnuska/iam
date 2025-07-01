// packages/services/src/auth/session.ts

import { getToken } from './tokenStorage'
import { setAuthHeader, getProfile } from '../api'
import type { User } from '@iam/types'

/**
 * Attempts to restore session using stored token.
 * Returns user profile on success, or null on failure.
 */
export const trySigninFromStoredToken = async (): Promise<User | null> => {
	try {
		const token = await getToken()

		if (!token) {
			console.warn('[auth] No token found in storage')
			return null
		}

		setAuthHeader(token)

		const profile = await getProfile()
		console.info('[auth] Session restored from token:', profile.username)
		return profile
	} catch (err: any) {
		console.warn('[auth] Failed to restore session from token')

		if (err?.response?.status === 401) {
			console.warn('[auth] Token expired or unauthorized (401)')
		} else if (err?.message?.includes?.('Network')) {
			console.warn('[auth] Network issue — possibly offline')
		} else {
			console.error('[auth] Unexpected error:', err)
		}
	}

	return null
}

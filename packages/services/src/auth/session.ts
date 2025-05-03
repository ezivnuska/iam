// packages/services/src/auth/session.ts

import { getToken, clearToken } from './tokenStorage'
import { setAuthHeader, clearAuthHeader, getProfile } from '../api'
import type { User } from '@iam/types'

/**
 * Attempts to restore session using stored token.
 * Returns user profile on success, or null on failure.
 */
export const trySigninFromStoredToken = async (): Promise<User | null> => {
	try {
		const token = await getToken()
		if (!token) return null

		setAuthHeader(token)

		const profile = await getProfile()
		return profile
	} catch (err) {
		await clearToken()
		clearAuthHeader()
		return null
	}
}
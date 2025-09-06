// packages/services/src/api/profile.ts

import { api } from './http'
import type { User } from '@iam/types'

/**
 * Get the current authenticated user's profile
 * Requires http-only cookie to be present
 */
export const getProfile = async (): Promise<User> => {
	try {
		const res = await api.get('/profile', { withCredentials: true })
		return res.data
	} catch (err) {
		console.error('Error fetching profile:', err)
		throw err
	}
}

/**
 * Update current authenticated user's profile
 * Requires http-only cookie to be present
 */
export const updateSelf = async (data: any): Promise<User> => {
	try {
		const res = await api.put('/profile', data, { withCredentials: true })
		return res.data
	} catch (err) {
		console.error('Error updating profile:', err)
		throw err
	}
}

/**
 * Set or unset avatar for current authenticated user
 * Uses PATCH to set and DELETE to unset
 */
export const setAvatar = async (imageId: string | null | undefined): Promise<User> => {
	try {
		if (imageId === undefined || imageId === null) {
			const res = await api.delete('/profile/avatar', { withCredentials: true })
			return res.data
		} else {
			const res = await api.patch(`/profile/avatar/${imageId}`, null, { withCredentials: true })
			return res.data
		}
	} catch (err) {
		console.error('Error updating avatar:', err)
		throw err
	}
}

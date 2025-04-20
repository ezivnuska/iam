// packages/auth/src/utils/payload.ts

import type { TokenPayload, UserRole } from '../types'

export const createPayload = (user: {
	_id: any
	username: string
	email: string
	role: UserRole
}): TokenPayload => ({
	id: user._id.toString(),
	username: user.username,
	email: user.email,
	role: user.role,
})
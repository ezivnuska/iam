// apps/backend/src/types/user.types.ts

import { UserRole } from '@iam/types'

export type AuthenticatedUser = {
	_id: string
	username: string
	email: string
	role: UserRole
}
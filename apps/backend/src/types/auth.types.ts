// apps/backend/src/types/auth.types.ts

import { UserRole } from '@iam/types'

export type AuthPayload = {
	_id: string
	username: string
	email: string
	role: UserRole
}
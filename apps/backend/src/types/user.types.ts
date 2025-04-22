// apps/backend/src/types/user.types.ts

import { UserRole } from '@iam/types'

export type AuthenticatedUser = {
	_id: string
	username: string
	email: string
	role: UserRole
}

// import { IUser } from '../models/user.model'

// export type AuthenticatedUser = Pick<IUser, 'username' | 'email' | 'role'> & {
// 	_id: string
// }
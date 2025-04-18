// apps/backend/src/types/user.types.ts

import { IUser } from '../models/user.model'

export type AuthenticatedUser = Pick<IUser, 'username' | 'email' | 'role'> & {
	_id: string
}
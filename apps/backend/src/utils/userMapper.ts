// apps/backend/src/utils/userMapper.ts

import type { IUser } from '../models/user.model'
import type { TokenPayload } from '@auth'

export const mapUserToClient = (user: IUser): TokenPayload => ({
	id: user._id.toString(),
	username: user.username,
	email: user.email,
	role: user.role,
})
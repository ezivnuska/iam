// packages/utils/src/normalizeUser.ts

import type { User } from '@iam/types'
import { normalizeImage } from './normalizeImage'

export function normalizeUser(user: any): User {
	return {
		id: user.id ?? user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		bio: user.bio ?? '',
		verified: user.verified ?? false,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		avatar: normalizeImage(user.avatar),
	}
}

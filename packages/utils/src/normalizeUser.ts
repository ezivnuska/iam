// packages/utils/src/normalizeUser.ts

import type { User } from '@iam/types'
import { normalizeImage } from './'

export function normalizeUser(user: any): User {
	const normalizedAvatar = normalizeImage(user.avatar)
	
	return {
		id: user.id ?? user._id,
		username: user.username,
		email: user.email,
		role: user.role,
		bio: user.bio ?? '',
		verified: user.verified ?? false,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		avatar: normalizedAvatar,
		avatarUrl: normalizedAvatar?.url,
	}
}
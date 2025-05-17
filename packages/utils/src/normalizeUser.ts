// packages/utils/src/normalizeUser.ts

import type { ImageDocument, User, UserDocument } from '@iam/types'
import { UserRole } from '@iam/types'

function isImageDocument(obj: unknown): obj is ImageDocument {
	return typeof obj === 'object' && obj !== null && '_id' in obj && 'filename' in obj
}

export const normalizeUser = (user: Partial<UserDocument> & { _id: any }): User => {
	return {
		id: user._id.toString(),
		username: user.username ?? '',
		email: user.email ?? '',
		role: user.role ?? UserRole.User,
		bio: user.bio ?? '',
		verified: !!user.verified,
		createdAt: new Date(user.createdAt ?? Date.now()).toISOString(),
		updatedAt: new Date(user.updatedAt ?? Date.now()).toISOString(),
		avatar: isImageDocument(user.avatar)
			? {
				id: user.avatar._id.toString(),
				filename: user.avatar.filename,
				username: user.avatar.username,
				url: user.avatar.url || '',
				width: user.avatar.width,
				height: user.avatar.height,
				alt: user.avatar.alt,
			}
			: undefined,
		avatarUrl: user.avatarUrl,
	}
}
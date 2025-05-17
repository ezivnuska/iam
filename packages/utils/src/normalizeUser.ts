// packages/utils/src/normalizeUser.ts

import type { ImageDocument, User, UserDocument } from '@iam/types'
import { isValidObjectId, Types } from 'mongoose'

function isImageDocument(obj: unknown): obj is ImageDocument {
	return typeof obj === 'object' && obj !== null && '_id' in obj && 'filename' in obj
}


export const normalizeUser = (user: UserDocument): User => {
	return {
		id: user._id.toString(),
		username: user.username,
		email: user.email,
		role: user.role,
		bio: user.bio,
		verified: user.verified,
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
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
		avatarUrl: isImageDocument(user.avatar)
			? user.avatar.url
			: undefined,
	}
}
// apps/backend/src/utils/userMapper.ts

import type { IUser } from '../models/user.model'
import type { User } from '@iam/types'

export const normalizeUser = (user: IUser): User => ({
	id: user._id.toString(),
	username: user.username,
	email: user.email,
	role: user.role,
	bio: user.bio,
	avatar: isPopulatedAvatar(user.avatar) ? {
		id: user.avatar._id.toString(),
		filename: user.avatar.filename,
		username: user.avatar.username,
		height: user.avatar.height,
		width: user.avatar.width,
		url: user.avatar.url,
	} : undefined,
	verified: user.verified,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
})

function isPopulatedAvatar(
	avatar: unknown
): avatar is {
	_id: any
	filename: string
	username: string
	height: number
	width: number
	url: string
} {
	return typeof avatar === 'object' &&
		avatar !== null &&
		'filename' in avatar &&
		'url' in avatar
}
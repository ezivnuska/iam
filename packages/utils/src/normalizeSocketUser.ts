// packages/utils/src/normalizeSocketUser.ts

import type { SocketUser } from '@iam/types'
import type { UserDocument } from '@iam/types'
import { normalizeSocketImage } from './normalizeSocketImage'

export function normalizeSocketUser(user: Partial<UserDocument>, minimal = false): SocketUser {
	return {
		id: user._id?.toString?.() ?? user.id ?? '',
		username: user.username ?? 'unknown',
		role: user.role ?? 'user',
		avatar: normalizeSocketImage(user.avatar),
	}
}

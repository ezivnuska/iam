// packages/utils/src/normalizeAuthor.ts

import type { Author } from '@iam/types'
import { normalizeImage } from './normalizeImage'

export function normalizeAuthor(user: any): Author {
	return {
		id: user._id?.toString() ?? user.id,
		username: user.username,
		avatar: normalizeImage(user.avatar),
	}
}

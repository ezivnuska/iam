// packages/utils/src/normalizeImage.ts

import { getAvatarUrl } from './'
import type { Image } from '@iam/types'

export function normalizeImage(img?: any): Image | undefined {
	if (!img) return undefined

	const url = img.url ?? getAvatarUrl(img.username, img.filename) ?? ''

	return {
		id: img._id?.toString?.() ?? img.id,
		filename: img.filename,
		username: img.username,
		url,
		alt: img.alt ?? '',
		variants: img.variants ?? [],
        likes: img.linkes,
        likedByCurrentUser: img.likedByCurrentUser,
	}
}

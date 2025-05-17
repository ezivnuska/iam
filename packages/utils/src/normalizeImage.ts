// packages/utils/src/normalizeImage.ts

import { getAvatarUrl } from './getAvatarUrl'
import type { Image } from '@iam/types'

export function normalizeImage(img?: any): Image | undefined {
	if (!img) return undefined
	const url = img.url ?? getAvatarUrl(img.username, img.filename) ?? ''
	
	return {
		id: img.id ?? img._id,
		filename: img.filename,
		username: img.username,
		url,
		width: img.width,
		height: img.height,
		alt: img.alt ?? '',
	}
}
// packages/utils/src/normalizeSocketImage.ts

import { getAvatarUrl } from './'
import type { SocketImage, ImageVariant } from '@iam/types'

export function normalizeSocketImage(img?: any): SocketImage | undefined {
	if (!img) return undefined

	const url = img.url ?? getAvatarUrl(img.username, img.filename) ?? ''
	const variants = (img.variants as ImageVariant[]) ?? []
	const thumbVariant = variants.find((v: ImageVariant) => v.size === 'thumb')

	return {
		id: img._id?.toString?.() ?? img.id,
        userId: img.userId,
		filename: img.filename,
		username: img.username,
		url,
		variants: thumbVariant ? [thumbVariant] : [],
		alt: img.alt ?? '',
	}
}

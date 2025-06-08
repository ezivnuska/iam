// apps/web/src/utils/getSafeImageData.ts

import { handleImageData, loadImage } from "./"

export async function getSafeImageData(uri: string, exif: Record<string, any> = {}) {
	try {
		const image = await loadImage(uri)
		return await handleImageData(image, exif)
	} catch (e) {
		console.error('getSafeImageData fallback triggered:', e)
		return {
			width: 0,
			height: 0,
			filename: `image-${Date.now()}.jpg`,
		}
	}
}

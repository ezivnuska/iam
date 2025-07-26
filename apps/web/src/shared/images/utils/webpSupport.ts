// apps/web/src/shared/images/utils/webpSupport.ts

export async function supportsWebP(): Promise<boolean> {
	return new Promise((resolve) => {
		const img = new Image()
		img.onload = () => resolve(img.width === 1)
		img.onerror = () => resolve(false)
		img.src =
			'data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICwAAAAQAgCdASoCAAIALGAcAA=='
	})
}
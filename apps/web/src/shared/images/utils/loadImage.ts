// apps/web/src/shared/images/utils/loadImage.ts

export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.crossOrigin = 'anonymous'
		image.decoding = 'async'

		image.onload = () => resolve(image)
		image.onerror = (err) => {
			console.error('Image failed to load:', src, err)
			reject(new Error('Failed to load image'))
		}

		image.src = src
	})
}

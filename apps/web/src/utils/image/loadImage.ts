// apps/web/src/utils/image/loadImage.ts

export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.crossOrigin = 'anonymous'
		image.onload = () => resolve(image)
		image.onerror = reject
		image.src = src
	})
}
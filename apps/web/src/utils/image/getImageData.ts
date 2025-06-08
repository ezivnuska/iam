// apps/web/src/utils/image/getImageData.ts

export function getImageData(
	image: HTMLImageElement,
	orientation: number = 1,
	maxSize: number = 1000,
	format: 'jpeg' | 'png' | 'webp' = 'webp',
): {
	width: number
	height: number
	dataUrl: string
} {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('Failed to get canvas context')
	}

	let { width, height } = image

	// Scale image if larger than maxSize
	const scale = Math.min(maxSize / width, maxSize / height, 1)
	width = Math.floor(width * scale)
	height = Math.floor(height * scale)

	// Handle EXIF orientation
	const [drawWidth, drawHeight] = [width, height]

	switch (orientation) {
		case 2:
			canvas.width = drawWidth
			canvas.height = drawHeight
			ctx.translate(drawWidth, 0)
			ctx.scale(-1, 1) // Flip horizontal
			break
		case 3:
			canvas.width = drawWidth
			canvas.height = drawHeight
			ctx.translate(drawWidth, drawHeight)
			ctx.rotate(Math.PI) // 180°
			break
		case 4:
			canvas.width = drawWidth
			canvas.height = drawHeight
			ctx.translate(0, drawHeight)
			ctx.scale(1, -1) // Flip vertical
			break
		case 5:
			canvas.width = drawHeight
			canvas.height = drawWidth
			ctx.rotate(0.5 * Math.PI)
			ctx.scale(1, -1)
			break
		case 6:
			canvas.width = drawHeight
			canvas.height = drawWidth
			ctx.translate(drawHeight, 0)
			ctx.rotate(0.5 * Math.PI) // 90°
			break
		case 7:
			canvas.width = drawHeight
			canvas.height = drawWidth
			ctx.translate(drawHeight, 0)
			ctx.rotate(0.5 * Math.PI)
			ctx.scale(-1, 1)
			break
		case 8:
			canvas.width = drawHeight
			canvas.height = drawWidth
			ctx.translate(0, drawWidth)
			ctx.rotate(-0.5 * Math.PI) // -90°
			break
		default:
			canvas.width = drawWidth
			canvas.height = drawHeight
			break
	}

	ctx.drawImage(image, 0, 0, width, height)

	const dataUrl = canvas.toDataURL(`image/${format}`, 0.9)

	return {
		width: canvas.width,
		height: canvas.height,
		dataUrl,
	}
}

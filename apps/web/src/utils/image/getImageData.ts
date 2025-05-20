// apps/web/src/utils/image/getImageData.ts

import { supportsWebP } from './webpSupport'

function applyOrientationTransform(
	ctx: CanvasRenderingContext2D,
	orientation: number,
	width: number,
	height: number
) {
	switch (orientation) {
		case 2: ctx.transform(-1, 0, 0, 1, width, 0); break              // Flip horizontal
		case 3: ctx.transform(-1, 0, 0, -1, width, height); break        // Rotate 180°
		case 4: ctx.transform(1, 0, 0, -1, 0, height); break             // Flip vertical
		case 5: ctx.transform(0, 1, 1, 0, 0, 0); break                   // Transpose
		case 6: ctx.transform(0, 1, -1, 0, height, 0); break             // Rotate 90°
		case 7: ctx.transform(0, -1, -1, 0, height, width); break        // Transverse
		case 8: ctx.transform(0, -1, 1, 0, 0, width); break              // Rotate -90°
		default: break
	}
}

type ImageDataResult = {
	uri: string
	height: number
	width: number
	blob: Blob
	file?: File
}

const imageDataCache = new Map<string, Promise<ImageDataResult>>()
const MAX_CACHE_SIZE = 50

export async function getImageData(
	image: HTMLImageElement,
	orientation: number,
	maxWidth: number,
	requestedFormat: 'webp' | 'jpeg' | 'png' = 'webp',
	quality: number = 0.9
): Promise<ImageDataResult> {
	const useWebP = requestedFormat === 'webp' && (await supportsWebP())
	const format = useWebP ? 'webp' : 'jpeg' // fallback if unsupported
	const mime = `image/${format}`

	const cacheKey = `${image.src}|${orientation}|${maxWidth}|${format}|${quality}`

	if (imageDataCache.has(cacheKey)) {
		const value = imageDataCache.get(cacheKey)!
		imageDataCache.delete(cacheKey)
		imageDataCache.set(cacheKey, value)
		return value
	}

	if (imageDataCache.size >= MAX_CACHE_SIZE) {
		const oldestKey = imageDataCache.keys().next().value
        if (typeof oldestKey === 'string') {
            imageDataCache.delete(oldestKey)
        }
	}

	const resultPromise = (async () => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		let width = image.naturalWidth
		let height = image.naturalHeight
		let drawWidth = width
		let drawHeight = height

		if (orientation > 4 && orientation < 9) {
			[drawWidth, drawHeight] = [height, width]
		}

		const scaleRatio = Math.min(1, maxWidth / Math.max(drawWidth, drawHeight))
		drawWidth = drawWidth * scaleRatio
		drawHeight = drawHeight * scaleRatio

		canvas.width = drawWidth
		canvas.height = drawHeight

		ctx?.save()
		if (ctx) {
			applyOrientationTransform(ctx, orientation, drawWidth, drawHeight)
			ctx.drawImage(image, 0, 0, width, height)
		}
		ctx?.restore()

		const dataUrl = canvas.toDataURL(mime, quality)
		const blob = await new Promise<Blob>((resolve) =>
			canvas.toBlob((b) => resolve(b!), mime, quality)
		)
		const file = new File([blob], `image-${Date.now()}.${format}`, { type: mime })

		return {
			uri: dataUrl,
			width: drawWidth,
			height: drawHeight,
			blob,
			file,
		}
	})()

	imageDataCache.set(cacheKey, resultPromise)
	return resultPromise
}

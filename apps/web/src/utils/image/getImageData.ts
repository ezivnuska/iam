// apps/web/src/utils/image/getImageData.ts

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

type ImageDataResult = { uri: string; height: number; width: number }

const imageDataCache = new Map<string, Promise<ImageDataResult>>()
const MAX_CACHE_SIZE = 50

export async function getImageData(
	image: HTMLImageElement,
	orientation: number,
	maxWidth: number
): Promise<ImageDataResult> {
	const cacheKey = `${image.src}|${orientation}|${maxWidth}`
	if (imageDataCache.has(cacheKey)) {
		// Move key to end to mark as recently used
		const value = imageDataCache.get(cacheKey)!
		imageDataCache.delete(cacheKey)
		imageDataCache.set(cacheKey, value)
		return value
	}

	// If cache limit reached, evict the oldest entry
	if (imageDataCache.size >= MAX_CACHE_SIZE) {
		const oldestKey = imageDataCache.keys().next().value
		imageDataCache.delete(oldestKey as string)
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

		if (drawWidth > maxWidth) {
			drawHeight = (maxWidth / drawWidth) * drawHeight
			drawWidth = maxWidth
		}

		canvas.width = drawWidth
		canvas.height = drawHeight

		ctx?.save()
		if (ctx) {
			applyOrientationTransform(ctx, orientation, drawWidth, drawHeight)
			ctx.drawImage(image, 0, 0, width, height)
		}
		ctx?.restore()

		const uri = canvas.toDataURL('image/png')
		return { uri, width: drawWidth, height: drawHeight }
	})()

	imageDataCache.set(cacheKey, resultPromise)
	return resultPromise
}
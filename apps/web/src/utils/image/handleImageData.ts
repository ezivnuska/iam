// apps/web/src/utils/image/handleImageData.ts

import { getImageData } from '.'

export async function handleImageData(
	image: HTMLImageElement,
	exif: Record<string, any> = {},
): Promise<{
	width: number
	height: number
	filename: string
}> {
	const srcOrientation = exif.Orientation || 1

	const imageData = await getImageData(image, srcOrientation, 600)
	const filename = `image-${Date.now()}.png`

	return {
		...imageData,
		filename,
	}
}

// apps/web/src/utils/image/handleImageData.ts

import { getImageData } from '.'

export async function handleImageData(
	image: HTMLImageElement,
	exif: Record<string, any> = {},
): Promise<{
	imageData: { uri: string; height: number; width: number; filename: string }
	thumbData: { uri: string; height: number; width: number; filename: string }
}> {
	const srcOrientation = exif.Orientation || 1

	const imageData = await getImageData(image, srcOrientation, 600)
	const thumbData = await getImageData(image, srcOrientation, 200)

	const filename = `image-${Date.now()}.png`

	return {
		imageData: { ...imageData, filename },
		thumbData: { ...thumbData, filename: `thumb-${filename}` },
	}
}

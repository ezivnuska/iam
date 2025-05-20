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
	const orientation = exif.Orientation || 1

	const imageData = await getImageData(image, orientation, 600, 'webp')
	const filename = `image-${Date.now()}.webp`

	return {
		...imageData,
		filename,
	}
}

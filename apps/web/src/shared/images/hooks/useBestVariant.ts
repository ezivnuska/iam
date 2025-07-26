// apps/web/src/shared/images/hooks/useBestVariant.ts

import { PixelRatio } from 'react-native'
import { getBestVariantUrl } from '../utils'
import type { Image } from '@iam/types'

/**
 * Returns the best image variant URL based on the given display width.
 * @param image The image object with variants.
 * @param containerWidth The available width to display the image.
 */
export function useBestVariant(image: Image, containerWidth: number): string {
	const pixelRatio = PixelRatio.get()

	if (!image?.url || !Array.isArray(image?.variants)) {
		console.warn('Image is missing url or variants:', image)
		return ''
	}

	return getBestVariantUrl(image.url, image.variants, containerWidth, pixelRatio)
}

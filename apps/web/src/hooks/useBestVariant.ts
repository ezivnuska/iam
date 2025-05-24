// apps/web/src/hooks/useBestVariant.ts

import { PixelRatio, useWindowDimensions } from 'react-native'
import { getBestVariantUrl } from '../utils/image'
import type { Image } from '@iam/types'

export function useBestVariant(image: Image): string {
	const { width } = useWindowDimensions()
	const pixelRatio = PixelRatio.get()

	if (!image?.url || !Array.isArray(image?.variants)) {
		console.warn('Image is missing url or variants:', image)
		return ''
	}

	return getBestVariantUrl(image.url, image.variants, width, pixelRatio)
}

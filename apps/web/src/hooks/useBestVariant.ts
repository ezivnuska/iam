// apps/web/src/hooks/useBestVariant.ts

import { PixelRatio, useWindowDimensions } from 'react-native'
import { getBestVariantUrl } from '../utils/image'
import type { Image } from '@iam/types'

export function useBestVariant(image: Image): string {
	const { width } = useWindowDimensions()
	const pixelRatio = PixelRatio.get()
	return getBestVariantUrl(image.url, image.variants, width, pixelRatio)
}

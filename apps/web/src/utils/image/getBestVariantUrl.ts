// apps/web/src/utils/image/getBestVariantForDisplay.ts

import { PixelRatio } from 'react-native'
import { ImageVariant } from '@iam/types'
import { buildVariantUrl } from './'

export function getBestVariantUrl(
    baseUrl: string,
    variants: ImageVariant[],
    targetWidth: number,
    pixelRatio?: number
): string {
    if (!variants.length || !baseUrl) return baseUrl

    const effectivePixelRatio = pixelRatio ?? PixelRatio.get()
    const effectiveWidth = targetWidth * effectivePixelRatio

    // Sort variants ascending by width
    const sorted = variants.slice().sort((a, b) => a.width - b.width)

    // Find first variant width >= effectiveWidth or fallback to largest
    const bestFit = sorted.find(v => v.width >= effectiveWidth) ?? sorted[sorted.length - 1]

    return buildVariantUrl(baseUrl, bestFit.size)
}

// apps/web/src/utils/image/getBestVariantUrl.ts

import { PixelRatio } from 'react-native'
import { ImageVariant } from '@iam/types'
import { buildVariantUrl } from './'

export function getBestVariantUrl(
    baseUrl: string,
    variants: ImageVariant[] = [],
    targetWidth: number,
    pixelRatio?: number
): string {
    if (!Array.isArray(variants) || variants.length === 0 || !baseUrl) return baseUrl;

    const effectivePixelRatio = pixelRatio ?? PixelRatio.get()
    const effectiveWidth = targetWidth * effectivePixelRatio

    const sorted = variants.slice().sort((a, b) => a.width - b.width)

    const bestFit = sorted.find(v => v.width >= effectiveWidth) ?? sorted[sorted.length - 1]

    return buildVariantUrl(baseUrl, bestFit.size)
}

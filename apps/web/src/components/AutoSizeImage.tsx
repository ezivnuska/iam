// apps/web/src/components/AutoSizeImage.tsx

import React from 'react'
import { Image as RNImage, ImageStyle } from 'react-native'
import type { Image as ImageType } from '@iam/types'
import { useBestVariant } from '@/hooks'

type AutoSizeImageProps = {
	image: ImageType
	style?: ImageStyle
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
}

const AutoSizeImage = ({ image, style, resizeMode = 'cover' }: AutoSizeImageProps) => {
	const bestUrl = useBestVariant(image)

	if (!bestUrl) {
		console.warn('No suitable image variant URL found.')
		return null
	}

	// Find the actual variant object to extract width/height
	const bestVariant = image.variants.find(variant =>
		bestUrl.includes(variant.filename)
	)

	let aspectRatio = 1
	if (bestVariant?.width && bestVariant?.height) {
		aspectRatio = bestVariant.width / bestVariant.height
	}

	return (
		<RNImage
			source={{ uri: bestUrl }}
			style={[{ width: '100%', aspectRatio }, style]}
			resizeMode={resizeMode}
		/>
	)
}

export default AutoSizeImage

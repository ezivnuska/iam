// apps/web/src/components/AutoSizeImage.tsx

import React from 'react'
import {
	Image as RNImage,
	StyleSheet,
	ImageStyle,
} from 'react-native'
import type { Image } from '@iam/types'
import { useBestVariant } from '@/hooks'

type AutoSizeImageProps = {
	image: Image
	style?: ImageStyle
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
}
  
const AutoSizeImage = ({ image, style, resizeMode = 'cover' }: AutoSizeImageProps) => {
	const bestUrl = useBestVariant(image)
    
	if (!bestUrl) {
		console.warn('No suitable image variant URL found.')
		return null
	}
  
	return (
		<RNImage
			source={{ uri: bestUrl }}
			style={[styles.image, style]}
			resizeMode={resizeMode}
		/>
	)
}

const styles = StyleSheet.create({
	image: {
		width: '100%',
		aspectRatio: 1,
	},
})

export default AutoSizeImage

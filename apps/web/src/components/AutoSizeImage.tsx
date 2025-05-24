// apps/web/src/components/AutoSizeImage.tsx

import React, { useState } from 'react'
import {
  View,
  Image as RNImage,
  ImageStyle,
  LayoutChangeEvent,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import type { Image as ImageType } from '@iam/types'
import { useBestVariant } from '@/hooks'

type AutoSizeImageProps = {
	image: ImageType
	style?: ImageStyle
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
	containerWidth?: number
    forceSquare?: boolean
  }
  
  const AutoSizeImage = ({
	image,
	style,
	resizeMode = 'cover',
	containerWidth,
    forceSquare = false,
  }: AutoSizeImageProps) => {
	const [measuredWidth, setMeasuredWidth] = React.useState<number | undefined>(undefined)
	
	const widthToUse = containerWidth ?? measuredWidth
  
	const onLayout = (event: LayoutChangeEvent) => {
	  if (containerWidth === undefined) { // only measure if not given
		const width = event.nativeEvent.layout.width
		if (width && width !== measuredWidth) {
		  setMeasuredWidth(width)
		}
	  }
	}
  
	const bestUrl = useBestVariant(image, widthToUse ?? 0)
  
	if (widthToUse === undefined) {
	  return <View onLayout={onLayout} style={style}><ActivityIndicator /></View>
	}
  
	if (!bestUrl) {
	  console.warn('No suitable image variant URL found.')
	  return null
	}

    if (forceSquare) {
        return (
            <RNImage
                source={{ uri: bestUrl }}
                style={[{ width: '100%', height: '100%' }, style]}
                resizeMode={resizeMode}
            />
        )
    }
  
	const bestVariant = image.variants.find(variant =>
	  bestUrl.includes(variant.filename)
	)
  
	const aspectRatio =
	  bestVariant?.width && bestVariant?.height
		? bestVariant.width / bestVariant.height
		: 1
  
	return (
	  <View onLayout={onLayout} style={style}>
		{measuredWidth && (
			<RNImage
				source={{ uri: bestUrl }}
				style={{ width: '100%', aspectRatio }}
				resizeMode={resizeMode}
			/>
		)}
	  </View>
	)
}  

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
})

export default AutoSizeImage

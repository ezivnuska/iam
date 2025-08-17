// apps/web/src/shared/ui/AutoSizeImage.tsx

import React from 'react'
import {
	View,
	Image as RNImage,
	ImageStyle,
	LayoutChangeEvent,
    Text,
    StyleSheet,
} from 'react-native'
import type { Image as ImageType } from '@iam/types'
import { useBestVariant } from '@shared/images'
import { Row } from '@shared/grid'
import { useTheme } from '@shared/hooks'
import { getModifiedColor } from '@shared/utils'

type AutoSizeImageProps = {
	image: ImageType
	style?: ImageStyle
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
	containerWidth?: number
    forceSquare?: boolean
}

export const AutoSizeImage = ({
	image,
	style,
	resizeMode = 'cover',
	containerWidth,
	forceSquare = false,
}: AutoSizeImageProps) => {
	if (!image) {
		console.warn('AutoSizeImage: image prop is undefined/null')
		return null
	}
	if (!Array.isArray(image.variants) || image.variants.length === 0) {
		console.warn('AutoSizeImage: image.variants is missing or empty')
		return null
	}
    
    const { theme } = useTheme()

	const [measuredWidth, setMeasuredWidth] = React.useState<number | undefined>(undefined)
  
	const widthToUse = containerWidth ?? measuredWidth
  
	const onLayout = (event: LayoutChangeEvent) => {
		if (containerWidth === undefined) {
			const width = event.nativeEvent.layout.width
			if (width && width !== measuredWidth) {
				setMeasuredWidth(width);
			}
		}
	}
  
	const bestUrl = useBestVariant(image, widthToUse ?? 0)
  
	if (widthToUse === undefined) {
		return <View onLayout={onLayout} style={style} />
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
  
	const bestVariant = image.variants.find((variant) => bestUrl.includes(variant.filename))
  
	const aspectRatio =
		bestVariant?.width && bestVariant?.height ? bestVariant.width / bestVariant.height : 1
    

    const renderPlaceholder = () => {
        return (
            <Row
                flex={1}
                align='center'
                justify='center'
                style={{ position: 'absolute', zIndex: 10, alignSelf: 'center' }}
                
            >
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Image Unavailable</Text>
            </Row>
        )
    }

	return (
		<View onLayout={onLayout} style={style}>
			{measuredWidth && (
                <Row align='center' justify='center' style={{ aspectRatio, position: 'relative', backgroundColor: getModifiedColor(theme.colors.text, 30, 0.25) }}>
                    {/* <Text style={{ position: 'absolute', zIndex: 10, alignSelf: 'center', color: theme.colors.background }}>Image Unavailable</Text> */}
                    {renderPlaceholder()}
                    <RNImage
                        source={{ uri: bestUrl }}
                        style={[StyleSheet.absoluteFillObject, { position: 'absolute', zIndex: 100 }]}
                        resizeMode={resizeMode}
                    />
                </Row>
			)}
		</View>
	)
}


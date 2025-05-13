// apps/web/src/components/ImageGallery.tsx

import React, { useMemo, useState } from 'react'
import {
	View,
	Text,
	Image,
	StyleSheet,
	FlatList,
	useWindowDimensions,
	LayoutChangeEvent,
} from 'react-native'
import { Button } from '.'
import type { ImageItem } from '@iam/types'
import { resolveResponsiveProp } from '../styles'

const IMAGE_MARGIN = 8

type ImageGalleryProps = {
	images: ImageItem[]
	currentAvatarId?: string
	onDelete?: (id: string) => void
	onSetAvatar?: (id: string) => void
}

const ImageGallery = ({ images, onDelete, onSetAvatar, currentAvatarId }: ImageGalleryProps) => {
	const { width: windowWidth } = useWindowDimensions()
	const [containerWidth, setContainerWidth] = useState<number>(windowWidth)

	const numColumns = resolveResponsiveProp({ sm: 2, md: 3, lg: 4 })

	const imageSize = useMemo(() => {
		if (!containerWidth) return 0
		return (containerWidth - IMAGE_MARGIN * (numColumns + 1)) / numColumns
	}, [containerWidth, numColumns])

	const onLayout = (e: LayoutChangeEvent) => {
		const layoutWidth = e.nativeEvent.layout.width
		if (layoutWidth !== containerWidth) {
			setContainerWidth(layoutWidth)
		}
	}

	const renderItem = ({ item }: { item: ImageItem }) => {
		const isAvatar = item._id === currentAvatarId

		return (
			<View style={[styles.imageBlock, imageSize ? { width: imageSize } : null]}>
				<View style={[styles.imageWrapper, isAvatar && styles.avatarHighlight]}>
					<Image source={{ uri: item.url }} style={styles.image} resizeMode='cover' />
				</View>
				<View style={styles.buttonRow}>
					<Button label='Delete' onPress={() => onDelete?.(item._id)} />
					{!isAvatar && <Button label='Set as Avatar' onPress={() => onSetAvatar?.(item._id)} />}
				</View>
			</View>
		)
	}

	return (
		<View style={{ flex: 1 }} onLayout={onLayout}>
			{!containerWidth ? (
				<Text style={{ textAlign: 'center', padding: 20 }}>Loading layout...</Text>
			) : (
				<FlatList
					key={`image-gallery-${numColumns}`}
					data={images}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${index}-${item._id}`}
					numColumns={numColumns}
					columnWrapperStyle={styles.columnWrapper}
					contentContainerStyle={styles.gallery}
					showsVerticalScrollIndicator={false}
					initialNumToRender={6}
					maxToRenderPerBatch={10}
					windowSize={5}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	gallery: {
		paddingVertical: IMAGE_MARGIN,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		gap: IMAGE_MARGIN,
		marginBottom: IMAGE_MARGIN * 2,
	},
	imageBlock: {
		alignItems: 'center',
	},
	imageWrapper: {
		borderRadius: 8,
		overflow: 'hidden',
		width: '100%',
		aspectRatio: 1,
	},
	avatarHighlight: {
		borderWidth: 3,
		borderColor: '#3498db',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	buttonRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		justifyContent: 'center',
		marginTop: 8,
	},
})

export default ImageGallery
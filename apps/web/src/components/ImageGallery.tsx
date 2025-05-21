// apps/web/src/components/ImageGallery.tsx

import React, { useMemo, useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	useWindowDimensions,
	LayoutChangeEvent,
	TouchableOpacity,
} from 'react-native'
import { AutoSizeImage, FullScreenImage } from '.'
import type { Image } from '@iam/types'
import { resolveResponsiveProp } from '../styles'
import { useModal } from '@/hooks'

const IMAGE_MARGIN = 8

type ImageGalleryProps = {
	images: Image[]
	currentAvatarId?: string | null | undefined
	onDelete?: (id: string) => void
	onSetAvatar?: (id: string | undefined) => void
}

const ImageGallery = ({ images, onDelete, onSetAvatar, currentAvatarId }: ImageGalleryProps) => {
	const { showModal, hideModal } = useModal()
	const { width: windowWidth } = useWindowDimensions()
	const [containerWidth, setContainerWidth] = useState<number>(windowWidth)

	const numColumns = resolveResponsiveProp({ xs: 2, sm: 2, md: 3, lg: 4 }) ?? 2

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

	const renderItem = ({ item }: { item: Image }) => {
        const isAvatar = item.id === currentAvatarId
		const newAvatarId = isAvatar ? undefined : item.id

		return (
			<TouchableOpacity
				onPress={() =>
					showModal(
						<FullScreenImage
							image={item}
							onClose={hideModal}
							onDelete={() => onDelete?.(item.id)}
							onSetAvatar={() => onSetAvatar?.(newAvatarId)}
							isAvatar={item.id === currentAvatarId}
						/>
					)
				}
				style={[styles.imageBlock, imageSize ? { width: imageSize } : null]}
			>
				<View style={[styles.imageWrapper, isAvatar && styles.avatarHighlight]}>
					<AutoSizeImage image={item} />
				</View>
			</TouchableOpacity>
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
					keyExtractor={(item) => item.id}
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

// const FullScreenImage = ({
// 	image,
// 	onClose,
// 	onDelete,
// 	onSetAvatar,
// 	isAvatar,
// }: {
// 	image: Image
// 	onClose: () => void
// 	onDelete?: () => void
// 	onSetAvatar?: () => void
// 	isAvatar?: boolean
// }) => {
// 	const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })

// 	// Use original image dimensions from variants (choose best variant or fallback)
// 	const originalWidth = image.variants?.[0]?.width ?? 0
// 	const originalHeight = image.variants?.[0]?.height ?? 0

// 	// Get responsive width and height
// 	const { width, height } = useResponsiveImageSize(originalWidth, originalHeight, 40)

// 	return (
// 		<View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
// 			<View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
// 				<View style={[styles.header, { paddingHorizontal }]}>
// 					<Row justify='flex-start' spacing={16}>
// 						{onDelete && (
// 							<Pressable onPress={onDelete}>
// 								<Ionicons name='trash-bin' size={28} color='white' />
// 							</Pressable>
// 						)}
// 						{!isAvatar && onSetAvatar && (
// 							<Pressable onPress={onSetAvatar}>
// 								<Ionicons name='person-circle-outline' size={28} color='white' />
// 							</Pressable>
// 						)}
// 					</Row>
// 					<Pressable onPress={onClose}>
// 						<Ionicons name='close-sharp' size={28} color='white' />
// 					</Pressable>
// 				</View>
// 				<View
// 					style={{
// 						flex: 1,
// 						justifyContent: 'center',
// 						alignItems: 'center',
// 						paddingHorizontal,
// 					}}
// 				>
// 					{/* Apply responsive width and height */}
// 					<AutoSizeImage
// 						image={image}
// 						style={{ width, height }}
// 						resizeMode='contain'
// 					/>
// 				</View>
// 			</View>
// 		</View>
// 	)
// }

const styles = StyleSheet.create({
	gallery: {
		paddingVertical: IMAGE_MARGIN,
	},
	columnWrapper: {
		justifyContent: 'flex-start',
		marginBottom: IMAGE_MARGIN,
	},
	imageBlock: {
		alignItems: 'center',
		marginHorizontal: IMAGE_MARGIN / 2,
	},
	imageWrapper: {
		borderRadius: 8,
		overflow: 'hidden',
		width: '100%',
		borderWidth: 1,
		backgroundColor: '#eee',
	},
	avatarHighlight: {
		borderWidth: 3,
		borderColor: '#3498db',
	},
	fullscreenContainer: {
		backgroundColor: 'black',
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 16,
		height: 50,
		zIndex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
})

export default ImageGallery

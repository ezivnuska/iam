// apps/web/src/components/ImageGallery.tsx

import React, { useMemo, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	LayoutChangeEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native'
import { AutoSizeImage, FullScreenImage } from '.'
import type { Image } from '@iam/types'
import { resolveResponsiveProp } from '../styles'
import { useAuth, useModal } from '@/hooks'

const IMAGE_MARGIN = 8

type ImageGalleryProps = {
	images: Image[]
	currentAvatarId?: string | null | undefined
	onDelete?: (id: string) => void
	onSetAvatar?: (id: string | undefined) => void
	onEndReached?: () => void
	loading?: boolean
}

const ImageGallery = ({ currentAvatarId, images, loading, onDelete, onSetAvatar, onEndReached }: ImageGalleryProps) => {
	const { user } = useAuth()
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

    const handleSetAvatar = (avatarId: string | undefined) => {
        onSetAvatar?.(avatarId)
    }

	const renderItem = ({ item }: { item: Image }) => {
        const isAvatar = item.id === currentAvatarId
		const newAvatarId = isAvatar ? undefined : item.id

		return (
			<TouchableOpacity
				onPress={() =>
					showModal({
                        content: (
                            <FullScreenImage
                                image={item}
                                onClose={hideModal}
                                onDelete={onDelete ? () => onDelete(item.id) : undefined}
                                onSetAvatar={user?.username === item.username ? () => handleSetAvatar(newAvatarId) : undefined}
                                isAvatar={isAvatar}
                            />
                        ),
                        fullscreen: true,
                    })
				}
				style={[styles.imageBlock, imageSize ? { width: imageSize } : null]}
			>
				<View style={[styles.imageWrapper, isAvatar && onSetAvatar && styles.avatarHighlight]}>
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
					onEndReached={onEndReached}
					onEndReachedThreshold={0.5}
					ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
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

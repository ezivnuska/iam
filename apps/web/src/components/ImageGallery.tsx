// apps/web/src/components/ImageGallery.tsx

import React, { useMemo, useState } from 'react'
import {
	View,
	Text,
	Image,
    Pressable,
	StyleSheet,
	FlatList,
	useWindowDimensions,
	LayoutChangeEvent,
    TouchableOpacity,
} from 'react-native'
import { Row } from '.'
import type { ImageItem } from '@iam/types'
import { resolveResponsiveProp } from '../styles'
import { useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'

const IMAGE_MARGIN = 8

type ImageGalleryProps = {
	images: ImageItem[]
	currentAvatarId?: string
	onDelete?: (id: string) => void
	onSetAvatar?: (id: string) => void
}

const ImageGallery = ({ images, onDelete, onSetAvatar, currentAvatarId }: ImageGalleryProps) => {
    const { showModal, hideModal } = useModal()
	const { width: windowWidth } = useWindowDimensions()
	const [containerWidth, setContainerWidth] = useState<number>(windowWidth)

	const numColumns = resolveResponsiveProp({ sm: 2, md: 3, lg: 4 }) ?? 2

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
            <TouchableOpacity
                onPress={() => showModal(
                    <FullScreenImage
                        uri={item.url}
                        onClose={hideModal}
                        onDelete={() => onDelete?.(item._id)}
                        onSetAvatar={() => onSetAvatar?.(item._id)}
                        isAvatar={isAvatar}
                    />
                )}
                style={[styles.imageBlock, imageSize ? { width: imageSize } : null]}
            >
                <View style={[styles.imageWrapper, isAvatar && styles.avatarHighlight]}>
                    <Image source={{ uri: item.url }} style={styles.image} resizeMode='cover' />
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

const FullScreenImage = ({
    uri,
	onClose,
	onDelete,
	onSetAvatar,
	isAvatar,
}: {
    uri: string;
    onClose: () => void;
    onDelete?: () => void;
    onSetAvatar?: () => void;
    isAvatar?: boolean;
}) => {
    return (
        <View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
            <View style={styles.header}>
                <Row justify='flex-start' spacing={16}>
                    {onDelete && (
                        <Pressable onPress={onDelete}>
                            <Ionicons name='trash-bin' size={28} color='white' />
                        </Pressable>
                    )}
                    {!isAvatar && onSetAvatar && (
                        <Pressable onPress={onSetAvatar}>
                            <Ionicons name='person-circle-outline' size={28} color='white' />
                        </Pressable>
                    )}
                </Row>
                <Pressable onPress={onClose}>
                    <Ionicons name='close-sharp' size={28} color='white' />
                </Pressable>
            </View>
            <Image
                source={{ uri }}
                style={StyleSheet.absoluteFill}
                resizeMode='contain'
            />
        </View>
    )
}

const styles = StyleSheet.create({
	gallery: {
		paddingVertical: IMAGE_MARGIN,
	},
	columnWrapper: {
        justifyContent: 'flex-start',
        marginBottom: IMAGE_MARGIN, // * 2,
        paddingHorizontal: IMAGE_MARGIN,
    },
	imageBlock: {
        alignItems: 'center',
    },
	imageWrapper: {
		borderRadius: 8,
		overflow: 'hidden',
		width: '100%',
		aspectRatio: 1,
        borderWidth: 1,
	},
	avatarHighlight: {
		borderWidth: 3,
		borderColor: '#3498db',
	},
	image: {
		width: '100%',
		height: '100%',
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
    controls: {

    },
	closeText: {
		color: '#fff',
		fontSize: 24,
		lineHeight: 24,
	},
})

export default ImageGallery
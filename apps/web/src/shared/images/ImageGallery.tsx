// apps/web/src/shared/images/ImageGallery.tsx

import React, { useMemo, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native'
import { AutoSizeImage, Spinner } from '@shared/ui'
import type { Image } from '@iam/types'
import { resolveResponsiveProp, Size } from '@iam/theme'
import Ionicons from '@expo/vector-icons/Ionicons'

type Props = {
	images: Image[]
	currentAvatarId?: string | null
	onImagePress: (image: Image) => void
	onDelete?: (id: string) => void
	onEndReached?: () => void
	loading?: boolean
}

const IMAGE_MARGIN = Size.XS

const ImageGallery = ({
	images,
	currentAvatarId,
	onImagePress,
	onEndReached,
	loading,
    onDelete,
}: Props) => {
	const { width: windowWidth } = useWindowDimensions()
	const [containerWidth, setContainerWidth] = useState<number>(windowWidth)

	const numColumns = resolveResponsiveProp({ xs: 2, sm: 2, md: 3, lg: 4 }) ?? 2

	const imageSize = useMemo(() => {
		return (containerWidth -(numColumns + 1)) / numColumns
	}, [containerWidth, numColumns])

	const onLayout = (e: any) => {
		const layoutWidth = e.nativeEvent.layout.width
		if (layoutWidth !== containerWidth) setContainerWidth(layoutWidth)
	}

	if (!containerWidth) {
		return <Spinner label='Calculating size...' />
	}

	return (
		<View style={{ flex: 1 }} onLayout={onLayout}>
			<FlatList
				data={images}
				key={`image-gallery-${numColumns}`}
				keyExtractor={(item) => item.id}
				numColumns={numColumns}
				columnWrapperStyle={styles.columnWrapper}
				contentContainerStyle={styles.gallery}
				style={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				scrollEnabled={true}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.5}
				initialNumToRender={6}
				maxToRenderPerBatch={10}
				windowSize={5}
				ListFooterComponent={
					loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
				}
				renderItem={({ item }) => {
					const isAvatar = item.id === currentAvatarId
					return (
                        <View style={[styles.imageBlock, isAvatar && styles.avatarHighlight]}>
                            <TouchableOpacity
                                onPress={() => onImagePress(item)}
                                style={[styles.imageWrapper, { width: imageSize }]}
                            >
								<AutoSizeImage image={item} />
                            </TouchableOpacity>
                            {onDelete && (
                                <TouchableOpacity
                                    onPress={() => onDelete(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name='close' size={30} color={'red'} />
                                </TouchableOpacity>
                            )}
                        </View>
					)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	gallery: {
		paddingVertical: IMAGE_MARGIN,
	},
	columnWrapper: {
		// justifyContent: 'center',
		marginBottom: IMAGE_MARGIN,
	},
	imageBlock: {
		alignItems: 'center',
        zIndex: 10,
	},
    deleteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 100,
    },
	imageWrapper: {
		paddingHorizontal: IMAGE_MARGIN / 2,
		borderRadius: 8,
		overflow: 'hidden',
		width: '100%',
		borderWidth: 1,
		backgroundColor: '#eee',
        position: 'relative',
	},
	avatarHighlight: {
		borderWidth: 3,
		borderColor: '#3498db',
	},
})

export default ImageGallery

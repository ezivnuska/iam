// apps/web/src/components/ImageGallery.tsx

import React from 'react'
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native'
import { AutoSizeImage, Spinner } from '@/components'
import type { Image } from '@iam/types'

const IMAGE_MARGIN = 8

type Props = {
	images: Image[]
	currentAvatarId?: string | null
	onPressImage: (image: Image) => void
	containerWidth: number
	imageSize: number
	numColumns: number
	onLayout: (e: any) => void
	onEndReached?: () => void
	loading?: boolean
}

const ImageGallery = ({
	images,
	currentAvatarId,
	onPressImage,
	containerWidth,
	imageSize,
	numColumns,
	onLayout,
	onEndReached,
	loading,
}: Props) => {
	return (
		<View style={{ flex: 1 }} onLayout={onLayout}>
			{!containerWidth ? (
				<Spinner />
			) : (
				<FlatList
					key={`image-gallery-${numColumns}`}
					data={images}
					style={{ flexGrow: 1 }}
					renderItem={({ item }) => {
						const isAvatar = item.id === currentAvatarId
						return (
							<TouchableOpacity
								onPress={() => onPressImage(item)}
								style={[styles.imageBlock, { width: imageSize }]}
							>
								<View style={[styles.imageWrapper, isAvatar && styles.avatarHighlight]}>
									<AutoSizeImage image={item} />
								</View>
							</TouchableOpacity>
						)
					}}
					keyExtractor={(item) => item.id}
					numColumns={numColumns}
					columnWrapperStyle={styles.columnWrapper}
					scrollEnabled={true}
					contentContainerStyle={styles.gallery}
					showsVerticalScrollIndicator={false}
					initialNumToRender={6}
					maxToRenderPerBatch={10}
					windowSize={5}
					onEndReached={onEndReached}
					onEndReachedThreshold={0.5}
					ListFooterComponent={loading
						? <ActivityIndicator style={{ marginVertical: 20 }} />
						: null
					}
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
})

export default ImageGallery

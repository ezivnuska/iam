// apps/web/src/components/images/ImageGallery.tsx

import React, { useMemo, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native'
import { AutoSizeImage, Spinner } from '@/components'
import type { Image } from '@iam/types'
import { resolveResponsiveProp } from '@iam/theme'

type Props = {
	images: Image[]
	currentAvatarId?: string | null
	onImagePress: (image: Image) => void
	onEndReached?: () => void
	loading?: boolean
}

const IMAGE_MARGIN = 0//8

const ImageGallery = ({
	images,
	currentAvatarId,
	onImagePress,
	onEndReached,
	loading,
}: Props) => {
	const { width: windowWidth } = useWindowDimensions()
	const [containerWidth, setContainerWidth] = useState<number>(windowWidth)

	const numColumns = resolveResponsiveProp({ xs: 2, sm: 2, md: 3, lg: 4 }) ?? 2

	const imageSize = useMemo(() => {
		return (containerWidth - IMAGE_MARGIN * (numColumns + 1)) / numColumns
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
						<TouchableOpacity
							onPress={() => onImagePress(item)}
							style={[styles.imageBlock, { width: imageSize }]}
						>
							<View style={[styles.imageWrapper, isAvatar && styles.avatarHighlight]}>
								<AutoSizeImage image={item} />
							</View>
						</TouchableOpacity>
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

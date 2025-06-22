// apps/web/src/components/ImageGalleryContainer.tsx

import React, { useMemo, useState } from 'react'
import { LayoutChangeEvent, useWindowDimensions } from 'react-native'
import { resolveResponsiveProp } from '@/styles'
import type { Image } from '@iam/types'
import { ImageGallery } from '@/components'

type Props = {
	images: Image[]
	currentAvatarId?: string | null
	onDelete?: (id: string) => void
	onSetAvatar?: (id: string | undefined) => void
	onEndReached?: () => void
	loading?: boolean
	onPressImage: (image: Image, isAvatar: boolean, newAvatarId: string | undefined) => void
}

const IMAGE_MARGIN = 8

const ImageGalleryContainer = ({
	images,
	currentAvatarId,
	onDelete,
	onSetAvatar,
	onEndReached,
	loading,
	onPressImage,
}: Props) => {
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

	const handleImagePress = (image: Image) => {
		const isAvatar = image.id === currentAvatarId
		const newAvatarId = isAvatar ? undefined : image.id
		onPressImage(image, isAvatar, newAvatarId)
	}

	return (
		<ImageGallery
			images={images}
			currentAvatarId={currentAvatarId}
			onPressImage={handleImagePress}
			containerWidth={containerWidth}
			imageSize={imageSize}
			numColumns={numColumns}
			onLayout={onLayout}
			onEndReached={onEndReached}
			loading={loading}
		/>
	)
}

export default ImageGalleryContainer

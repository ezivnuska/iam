// apps/web/src/components/images/ImageGalleryContainer.tsx

import React, { useEffect, useMemo, useState } from 'react'
import { Text } from 'react-native'
import { Column, ImageGallery, ImageGalleryHeader, ImageModal } from '@/components'
import { useAuth, useImage, useModal } from '@/hooks'
import type { Image } from '@iam/types'

interface ImageGalleryContainerProps {
	userId?: string
}

export const ImageGalleryContainer: React.FC<ImageGalleryContainerProps> = ({ userId }) => {
	const { user: authUser } = useAuth()
	const isAdmin = authUser?.role === 'admin'
	const isOwner = useMemo(() => {
        return !userId || authUser?.id === userId
    }, [userId])
	
	const {
		images,
		isLoading,
		deleteImage,
		setAvatar,
		currentAvatarId,
		loadImages,
		hasNextPage,
	} = useImage()

	const { hideModal, showModal } = useModal()
	const [error, setError] = useState<string | null>(null)

    useEffect(() => {
		if (userId && images.length === 0 && !isLoading) {
			loadImages(userId)
		}
	}, [images.length, isLoading, loadImages])

	const handleDelete = async (id: string) => {
		if (!isOwner && !isAdmin) {
            console.log('Only the image owner or an admin can delete images.')
            return
        }
		try {
			if (id === currentAvatarId) await setAvatar(undefined)
			await deleteImage(id)
			hideModal()
		} catch (err) {
			console.error('Failed to delete image:', err)
			setError('Failed to delete image.')
		}
	}

	const handleSetAvatar = async (id: string | undefined) => {
		const newAvatarId = id === currentAvatarId ? undefined : id
		try {
			await setAvatar(newAvatarId)
		} catch (err) {
			console.error('Failed to set avatar')
			setError('Failed to set avatar.')
		}
	}

	const handleImagePress = (image: Image) => {
		const isAvatar = image.id === currentAvatarId
        showModal((
            <ImageModal
                selectedImage={image}
                onClose={hideModal}
                onDelete={(isAdmin || isOwner) ? () => handleDelete(image.id) : undefined}
                onSetAvatar={isOwner ? () => handleSetAvatar(image.id) : undefined}
                isAvatar={isAvatar}
            />
        ), true)
	}

	return (
		<Column flex={1} spacing={10}>
			{/* <ImageGalleryHeader owner={isOwner} /> */}
			{error ? (
				<Text>{error}</Text>
			) : (
				<ImageGallery
					images={images}
					currentAvatarId={currentAvatarId}
					onImagePress={handleImagePress}
					loading={isLoading}
					onEndReached={() => hasNextPage && loadImages()}
				/>
			)}
		</Column>
	)
}

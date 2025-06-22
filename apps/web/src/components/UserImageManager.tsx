// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Column, FullScreenImage, ImageManagerHeader } from '@/components'
import ImageGalleryContainer from '@/components/ImageGalleryContainer'
import { useAuth, useImage, useModal } from '@/hooks'
import type { Image } from '@iam/types'

const UserImageManager = () => {
    const { user } = useAuth()
	const {
		images,
		isLoading,
		deleteImage,
		setAvatar,
		currentAvatarId,
		loadImages,
		loadMoreImages,
		hasNextPage,
	} = useImage()
	const { hideModal, showModal } = useModal()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		loadImages().catch(() => setError('Failed to load images.'))
	}, [loadImages])

	const handleDelete = async (id: string) => {
		try {
			if (id === currentAvatarId) {
				await setAvatar(undefined)
			}
			await deleteImage(id)
			hideModal()
		} catch (err) {
			console.log('Failed to delete image:', err)
			setError('Failed to delete image.')
		}
	}

	const handleSetAvatar = async (id: string | undefined) => {
		const newAvatarId = id === currentAvatarId ? undefined : id
		try {
			await setAvatar(newAvatarId)
			// hideModal()
		} catch (err) {
			console.log('Failed to set avatar')
			setError('Failed to set avatar.')
		}
	}

    const handleImagePress = (image: Image) => {
        const isAvatar = image.id === currentAvatarId
        const newAvatarId = image.id === currentAvatarId ? undefined : image.id
        showModal({
            content: (
                <FullScreenImage
                    image={image}
                    onClose={hideModal}
                    onDelete={handleDelete ? () => handleDelete(image.id) : undefined}
                    onSetAvatar={user?.username === image.username ? (id) => handleSetAvatar(id) : undefined}
                    isAvatar={isAvatar}
                />
            ),
            fullscreen: true,
        })
    }

	return (
		<Column flex={1} spacing={10}>
			<ImageManagerHeader />
			{error ? (
				<Text>{error}</Text>
			) : isLoading && images.length === 0 ? (
				<Text>Loading images...</Text>
			) : (
				<View style={{ flex: 1 }}>
					<ImageGalleryContainer
						images={images}
						onDelete={handleDelete}
						onSetAvatar={(id) => handleSetAvatar(id)}
                        onPressImage={handleImagePress}
						currentAvatarId={currentAvatarId}
						onEndReached={() => {
							if (hasNextPage) loadMoreImages()
						}}
						loading={isLoading}
					/>
				</View>
			)}
		</Column>
	)
}

export default UserImageManager

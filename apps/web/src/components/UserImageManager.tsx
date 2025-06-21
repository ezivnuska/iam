// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Column, ImageGallery, ImageManagerHeader } from '@/components'
import { useImage, useModal } from '@/hooks'

const UserImageManager = () => {
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
	const { hideModal } = useModal()
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
			hideModal()
		} catch (err) {
			console.log('Failed to set avatar')
			setError('Failed to set avatar.')
		}
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
					<ImageGallery
						images={images}
						onDelete={handleDelete}
						onSetAvatar={handleSetAvatar}
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

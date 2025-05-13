// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Column, ImageGallery, ImageManagerHeader } from '.'
import { useImages } from '@/providers'


const UserImageManager = () => {
	const { images, isLoading, deleteImage, setAvatar, currentAvatarId, addImage, loadImages } = useImages()
	const [hasLoaded, setHasLoaded] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!hasLoaded) {
			loadImages()
				.then(() => setHasLoaded(true))
				.catch(err => setError('Failed to load images.'))
		}
	}, [hasLoaded])

	return (
		<Column spacing={10}>
			<ImageManagerHeader />
			{error ? (
				<Text>{error}</Text>
			) : isLoading ? (
				<Text>Loading images...</Text>
			) : (
				<ImageGallery
					images={images}
					onDelete={deleteImage}
					onSetAvatar={setAvatar}
					currentAvatarId={currentAvatarId}
				/>
			)}
		</Column>
	)
}

export default UserImageManager
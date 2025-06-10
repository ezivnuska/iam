// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Column, ImageGallery, ImageManagerHeader } from '.'
import { useImage, useModal } from '@/hooks'


const UserImageManager = () => {
	const { images, isLoading, deleteImage, setAvatar, currentAvatarId, loadImages } = useImage()
	const { hideModal } = useModal()
	const [hasLoaded, setHasLoaded] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
        loadImages().catch(() => setError('Failed to load images.'))
    }, [])

    const handleDelete = async (id: string) => {
        try {
            // If the image is avatar, unset the avatar
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
		<Column spacing={10}>
			<ImageManagerHeader />
			{error ? (
				<Text>{error}</Text>
			) : isLoading ? (
				<Text>Loading images...</Text>
			) : (
				<ImageGallery
					images={images}
					onDelete={handleDelete}
					onSetAvatar={handleSetAvatar}
					currentAvatarId={currentAvatarId}
				/>
			)}
		</Column>
	)
}

export default UserImageManager
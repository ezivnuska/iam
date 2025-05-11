// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { getUserById, setAvatar, deleteImage, fetchUserImages } from '@services'
import { ImageGallery, ImageUpload } from '.'
import type { ImageItem } from '@iam/types'
import { useAuth } from '@/hooks'

const UserImageManager = () => {
    const { user, setUser } = useAuth()
	const [images, setImages] = useState<ImageItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

	const loadImages = async () => {
		try {
            const data = await fetchUserImages()
            setImages(data)
		} catch (error) {
            console.error('Error fetching images:', error)
		}
	}

    const handleSetAvatar = async (imageId: string) => {
        try {
            await setAvatar(imageId)
            if (!user) {
                throw new Error('No user found')
                return
            }
            const userWithAvatar = await getUserById(user.id)
            setUser(userWithAvatar)
            console.log('Avatar updated!')
        } catch (err) {
            console.error('Failed to set avatar:', err)
            throw new Error('Error setting avatar')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteImage(id)
            setImages(prev => prev.filter(img => img._id !== id))
        } catch (err) {
            console.error('Failed to delete image:', err)
        }
    }

    useEffect(() => {
        loadImages().finally(() => setIsLoading(false))
    }, [])

	const handleUploadSuccess = (newImage: ImageItem) => {
		setImages(prev => [newImage, ...prev])
	}
    
	return (
		<>
			<ImageUpload onUploadSuccess={handleUploadSuccess} />
			{isLoading ? (
                <Text>Loading images...</Text>
            ) : (
                <ImageGallery
                    images={images}
                    onDelete={handleDelete}
                    onSetAvatar={handleSetAvatar}
                    currentAvatarId={user?.avatar?.id}
                />
            )}
		</>
	)
}

export default UserImageManager
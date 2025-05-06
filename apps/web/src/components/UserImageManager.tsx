// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { deleteImage, fetchUserImages } from '@services'
import { ImageGallery, ImageUpload } from '.'
import type { ImageItem } from '@iam/types'

const UserImageManager = () => {
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
                <ImageGallery images={images} onDelete={handleDelete} />
            )}
		</>
	)
}

export default UserImageManager
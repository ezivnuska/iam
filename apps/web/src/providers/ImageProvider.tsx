// apps/web/src/providers/ImageProvider.tsx

import React, { createContext, useContext, useState, useCallback } from 'react'
import { getUserById, setAvatar as apiSetAvatar, deleteImage as apiDeleteImage, fetchUserImages } from '@services'
import { useAuth } from '@/hooks'
import type { ImageItem } from '@iam/types'

export type ImageContextType = {
	images: ImageItem[]
	isLoading: boolean
	currentAvatarId?: string
	loadImages: () => Promise<void>
	setAvatar: (imageId: string | undefined) => Promise<void>
	deleteImage: (id: string) => Promise<void>
	addImage: (image: ImageItem) => void
}

export const ImageContext = createContext<ImageContextType | null>(null)

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, setUser } = useAuth()
	const [images, setImages] = useState<ImageItem[]>([])
	const [isLoading, setIsLoading] = useState(true)

    const setAvatar = async (imageId: string | undefined) => {
        try {
            // Call the updated setAvatar function (which now handles undefined properly)
            await apiSetAvatar(imageId);
        
            // After setting or unsetting the avatar, reload user data
            if (!user) throw new Error('No user found');
            const updatedUser = await getUserById(user.id);
            setUser(updatedUser); // Update the local user state
        } catch (err) {
            console.error('Failed to set avatar:', err);
        }
    }    

	const deleteImage = async (id: string) => {
        try {
            await apiDeleteImage(id)
            setImages(prev => prev.filter(img => img._id !== id))
    
            // If the deleted image is the current avatar, clear it
            if (user?.avatar?.id === id) {
                await setAvatar(undefined); // Remove the avatar
            }
        } catch (err) {
            console.error('Failed to delete image:', err)
        }
    }    

	const addImage = (image: ImageItem) => {
		setImages(prev => [image, ...prev])
	}

	const currentAvatarId = user?.avatar?.id

	const loadImages = useCallback(async () => {
		try {
			setIsLoading(true)
			const data = await fetchUserImages()
			setImages(data)
		} catch (error) {
			console.error('Error fetching images:', error)
		} finally {
			setIsLoading(false)
		}
	}, []) 

	return (
		<ImageContext.Provider
			value={{ images, isLoading, currentAvatarId, loadImages, setAvatar, deleteImage, addImage }}
		>
			{children}
		</ImageContext.Provider>
	)
}

export const useImageContext = () => {
	const ctx = useContext(ImageContext)
	if (!ctx) throw new Error('useImageContext must be used within an ImageProvider')
	return ctx
}
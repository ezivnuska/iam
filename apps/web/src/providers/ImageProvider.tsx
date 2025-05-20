// apps/web/src/providers/ImageProvider.tsx

import React, { createContext, useContext, useState, useCallback } from 'react'
import { getUserById, setAvatar as apiSetAvatar, deleteImage as apiDeleteImage, fetchUserImages } from '@services'
import { useAuth } from '@/hooks'
import type { Image } from '@iam/types'

export type ImageContextType = {
	images: Image[]
	isLoading: boolean
	currentAvatarId?: string
	loadImages: () => Promise<void>
	setAvatar: (imageId?: string) => Promise<void>
	deleteImage: (id: string) => Promise<void>
	addImage: (image: Image) => void
}

export const ImageContext = createContext<ImageContextType | null>(null)

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, setUser } = useAuth()
	const [images, setImages] = useState<Image[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const currentAvatarId = user?.avatar?.id

	const loadImages = useCallback(async () => {
		if (!user) return
		setIsLoading(true)
		try {
			const data = await fetchUserImages()
			setImages(data)
		} catch (error) {
			console.error('Error fetching images:', error)
		} finally {
			setIsLoading(false)
		}
	}, [user])

	const setAvatar = async (imageId?: string) => {
		if (!user) return

		try {
			await apiSetAvatar(imageId)
			const updatedUser = await getUserById(user.id)
			setUser(updatedUser)
		} catch (err) {
			console.error('Failed to update avatar:', err)
		}
	}

	const deleteImage = async (id: string) => {
        try {
            await apiDeleteImage(id)
    
            // Ensure avatar is unset *before* reloading
            if (user?.avatar?.id === id) {
                await setAvatar(undefined)
            }
    
            // Refresh image list from server
            await loadImages()
        } catch (err) {
            console.error('Failed to delete image:', err)
        }
    }    

	const addImage = (image: Image) => {
		setImages(prev => [image, ...prev])
	}

	return (
		<ImageContext.Provider
			value={{
				images,
				isLoading,
				currentAvatarId,
				loadImages,
				setAvatar,
				deleteImage,
				addImage,
			}}
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

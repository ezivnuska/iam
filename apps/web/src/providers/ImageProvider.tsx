// apps/web/src/providers/ImageProvider.tsx

import React, { createContext, useContext, useState, useCallback } from 'react'
import { getUserById, setAvatar as apiSetAvatar, deleteImage as apiDeleteImage, fetchUserImages } from '@services'
import { useAuth } from '@/hooks'
import type { ImageItem } from '@iam/types'

type ImageContextType = {
	images: ImageItem[]
	isLoading: boolean
	currentAvatarId?: string
	loadImages: () => Promise<void>
	setAvatar: (imageId: string) => Promise<void>
	deleteImage: (id: string) => Promise<void>
	addImage: (image: ImageItem) => void
}

const ImageContext = createContext<ImageContextType | null>(null)

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, setUser } = useAuth()
	const [images, setImages] = useState<ImageItem[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const setAvatar = async (imageId: string) => {
		try {
			await apiSetAvatar(imageId)
			if (!user) throw new Error('No user found')
			const updatedUser = await getUserById(user.id)
			setUser(updatedUser)
		} catch (err) {
			console.error('Failed to set avatar:', err)
		}
	}

	const deleteImage = async (id: string) => {
		try {
			await apiDeleteImage(id)
			setImages(prev => prev.filter(img => img._id !== id))
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

export const useImages = () => {
	const ctx = useContext(ImageContext)
	if (!ctx) throw new Error('useImages must be used within a ImageProvider')
	return ctx
}
// apps/web/src/providers/ImageProvider.tsx

import React, { createContext, useState, useCallback } from 'react'
import { getUserById, setAvatar as apiSetAvatar, deleteImage as apiDeleteImage, fetchUserImages } from '@services'
import { useAuth } from '@/hooks'
import type { Image } from '@iam/types'

export type ImageContextType = {
	images: Image[]
	isLoading: boolean
	currentAvatarId?: string | null | undefined
	loadImages: (page?: number) => Promise<void>
	loadMoreImages: () => Promise<void>
	setAvatar: (imageId?: string | null) => Promise<void>
	deleteImage: (id: string) => Promise<void>
	addImage: (image: Image) => void
	hasNextPage: boolean
}

export const ImageContext = createContext<ImageContextType | null>(null)

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, setUser } = useAuth()
	const [images, setImages] = useState<Image[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [hasNextPage, setHasNextPage] = useState(true)

	const currentAvatarId = user?.avatar?.id

	const loadImages = useCallback(async () => {
		if (!user) return
		setIsLoading(true)
		try {
			const data = await fetchUserImages({ page: 1, limit: 12 })
			setImages(data.images)
			setPage(1)
			setHasNextPage(data.images.length === 12)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}, [user])

	const loadMoreImages = useCallback(async () => {
		if (!user || !hasNextPage) return
		const nextPage = page + 1
		try {
			const more = await fetchUserImages({ page: nextPage, limit: 12 })
			setImages(prev => [...prev, ...more.images])
			setPage(nextPage)
			setHasNextPage(more.images.length === 12)
		} catch (err) {
			console.error(err)
		}
	}, [user, page, hasNextPage])

	const setAvatar = async (imageId?: string | null) => {
		if (!user) return
		try {
			const { id } = await apiSetAvatar(imageId)
			const updatedUser = await getUserById(id)
			setUser(updatedUser)
		} catch (err) {
			console.error('Failed to update avatar:', err)
		}
	}

	const deleteImage = async (id: string) => {
		try {
			await apiDeleteImage(id)
	
			if (user?.avatar?.id === id) {
				await setAvatar(undefined)
			}

			setImages(prevImages => prevImages.filter(image => image.id !== id))
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
				currentAvatarId,
				hasNextPage,
				images,
				isLoading,
				addImage,
				deleteImage,
				loadImages,
				loadMoreImages,
				setAvatar,
			}}
		>
			{children}
		</ImageContext.Provider>
	)
}

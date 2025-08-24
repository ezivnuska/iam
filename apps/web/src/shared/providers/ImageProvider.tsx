// apps/web/src/shared/providers/ImageProvider.tsx

import React, { createContext, useEffect, useRef, useState, useCallback } from 'react'
import { getUserById, setAvatar as apiSetAvatar, deleteImage as apiDeleteImage, fetchUserImages } from '@iam/services'
import { useAuth } from '@features/auth'
import type { Image } from '@iam/types'

export type ImageContextType = {
	images: Image[]
	isLoading: boolean
	currentAvatarId?: string | null | undefined
	loadImages: (userId?: string) => Promise<void>
	setAvatar: (imageId?: string | null) => Promise<void>
	deleteImage: (id: string) => Promise<void>
	addImage: (image: Image) => void
	hasNextPage: boolean
}

export const ImageContext = createContext<ImageContextType | null>(null)

export const ImageProvider: React.FC<{
	children: React.ReactNode
	userId?: string
}> = ({ children, userId }) => {
	const { user, setUser, isAuthInitialized } = useAuth()
    const effectiveUserId = userId ?? user?.id

	const [images, setImages] = useState<Image[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [hasNextPage, setHasNextPage] = useState(true)

	const isLoadingRef = useRef(false)

	const currentAvatarId = user?.avatar?.id

	const loadImages = async (userIdOverride?: string, pageOverride?: number) => {
        const uid = userIdOverride ?? (userId ?? user?.id)
        const pageToLoad = pageOverride ?? page
        if (!uid || isLoadingRef.current) return
    
        isLoadingRef.current = true
        setIsLoading(true)
    
        try {
            const { images: fetchedImages, hasNextPage: more } = await fetchUserImages({
                userId: uid,
                page: pageToLoad,
                limit: 12,
            })

            setImages(prev => [...prev, ...fetchedImages])
            setPage(prev => prev + 1)
            setHasNextPage(more)
        } catch (err) {
            console.error('Failed to fetch images:', err)
        } finally {
            isLoadingRef.current = false
            setIsLoading(false)
        }
    }    

    useEffect(() => {
        if (!isAuthInitialized && !userId) return
        setImages([])
        setPage(1)
        loadImages(userId ?? user?.id, 1)
    }, [isAuthInitialized, userId, user?.id])            

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
				addImage: image => setImages(prev => [image, ...prev]),
				deleteImage: async id => {
					try {
						await apiDeleteImage(id)
						if (user?.avatar?.id === id) await setAvatar(undefined)
						setImages(prev => prev.filter(image => image.id !== id))
					} catch (err) {
						console.error('Failed to delete image:', err)
					}
				},
				loadImages,
				setAvatar,
			}}
		>
			{children}
		</ImageContext.Provider>
	)
}

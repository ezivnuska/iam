// apps/web/src/hooks/useUserImages.ts

import { useEffect, useState } from 'react'
import { fetchUserImages } from '@services'
import type { Image } from '@iam/types'

export const useUserImages = () => {
	const [images, setImages] = useState<Image[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadUserImages = async (username: string) => {
        try {
            const data = await fetchUserImages(username)
            setImages(data)
        } catch (err) {
            setError('Could not load images.')
        } finally {
            setIsLoading(false)
        }
    }

	return { images, isLoading, error, loadUserImages }
}

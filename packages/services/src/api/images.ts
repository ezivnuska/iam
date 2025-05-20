// packages/services/src/api/images.ts

import { Platform } from 'react-native'
import { api } from './http'
import { normalizeImage } from '@utils'
import type { Image, UploadedImage } from '@iam/types'

type ImageData = {
	uri: string
	filename: string
}

type ImageUploadData = {
	imageData: ImageData
}

export const uploadAvatar = async (formData: FormData): Promise<Image> => {
	const res = await api.post('/images/avatar/upload', formData)
	return normalizeImage(res.data)!
}

export const fetchUserImages = async (): Promise<Image[]> => {
	const res = await api.get<UploadedImage[]>('/images')
	return res.data.map(normalizeImage).filter(Boolean) as Image[]
}

export const uploadImage = async ({ imageData }: ImageUploadData): Promise<UploadedImage> => {
	const formData = new FormData()

	if (Platform.OS === 'web') {
        let file: File
    
        if (imageData.uri.startsWith('data:image')) {
            // Convert base64 to Blob
            const res = await fetch(imageData.uri)
            const blob = await res.blob()
            file = new File([blob], imageData.filename || 'upload.jpg', {
                type: blob.type || 'image/jpeg',
            })
        } else {
            // Assume it's a blob URL or regular URL
            const res = await fetch(imageData.uri)
            const blob = await res.blob()
            file = new File([blob], imageData.filename || 'upload.jpg', {
                type: blob.type || 'image/jpeg',
            })
        }
    
        formData.append('image', file)
    }
    

	const res = await api.post('/images/upload', formData)
	return res.data as UploadedImage
}

export const deleteImage = async (imageId: string) => api.delete(`/images/${imageId}`).then((res) => res.data)
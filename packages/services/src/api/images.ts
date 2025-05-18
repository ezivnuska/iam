// packages/services/src/api/images.ts

import { Platform } from 'react-native'
import { api } from './http'

export const uploadAvatar = async (formData: FormData) => api.post('/images/avatar/upload', formData)
export const fetchUserImages = async () => api.get('/images').then((res) => res.data)
export const deleteImage = async (imageId: string) => api.delete(`/images/${imageId}`).then((res) => res.data)

type ImageData = {
	uri: string
	filename: string
}

type ImageUploadData = {
	imageData: ImageData
}

export const uploadImage = async ({ imageData }: ImageUploadData) => {
    const formData = new FormData()
  
    if (Platform.OS === 'web') {
        const blob = await (await fetch(imageData.uri)).blob()
        const file = new File([blob], imageData.filename || 'upload.jpg', { type: 'image/jpeg' })
    
        formData.append('image', file)
    } else {
        formData.append('image', {
            uri: imageData.uri,
            name: imageData.filename || 'upload.jpg',
            type: 'image/jpeg',
        } as any)
    }
  
    const response = await api.post('/images/upload', formData)
  
    return response.data
}
  
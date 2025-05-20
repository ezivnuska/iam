// packages/services/src/api/images.ts

import { Platform } from 'react-native'
import { api } from './http'
import { normalizeImage } from '@utils/normalizeImage'
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
		const blob = await (await fetch(imageData.uri)).blob()
		const file = new File([blob], imageData.filename || 'upload.jpg', {
			type: 'image/jpeg',
		})
		formData.append('image', file)
	} else {
		formData.append('image', {
			uri: imageData.uri,
			name: imageData.filename || 'upload.jpg',
			type: 'image/jpeg',
		} as any)
	}

	const res = await api.post('/images/upload', formData)
	return res.data as UploadedImage
}

export const deleteImage = async (imageId: string) => api.delete(`/images/${imageId}`).then((res) => res.data)
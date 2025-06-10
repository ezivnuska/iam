// packages/services/src/api/images.ts

import { Platform } from 'react-native'
import { api } from './http'
import { normalizeImage } from '@utils'
import { uriToFile } from '../utils'
import type { Image, UploadedImage } from '@iam/types'
import * as commentService from './comments'

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

export const fetchUserImages = async (userId?: string): Promise<Image[]> => {
	const endpoint = userId ? `/images/${userId}` : `/images`
	const res = await api.get<UploadedImage[]>(endpoint)
	return res.data.map(normalizeImage).filter(Boolean) as Image[]
}

export const uploadImage = async ({ imageData }: ImageUploadData): Promise<UploadedImage> => {
	const formData = new FormData()

	if (Platform.OS === 'web') {
        const file = await uriToFile(imageData.uri, imageData.filename || 'upload.jpg')
    
        // if (imageData.uri.startsWith('data:image')) {
        //     // Convert base64 to Blob
        //     file = await uriToFile(imageData.uri, imageData.filename || 'upload.jpg')
        //     // const res = await fetch(imageData.uri)
        //     // const blob = await res.blob()
        //     // file = new File([blob], imageData.filename || 'upload.jpg', {
        //     //     type: blob.type || 'image/jpeg',
        //     // })
        // } else {
        //     // Assume it's a blob URL or regular URL
        //     const res = await fetch(imageData.uri)
        //     const blob = await res.blob()
        //     file = new File([blob], imageData.filename || 'upload.jpg', {
        //         type: blob.type || 'image/jpeg',
        //     })
        // }
    
        formData.append('image', file)
    }
    

	const res = await api.post('/images/upload', formData)
	return res.data as UploadedImage
}

export const deleteImage = async (imageId: string) => api.delete(`/images/${imageId}`).then((res) => res.data)

export const fetchImageLikes = async (imageId: string) => {
    const res = await api.get(`/images/${imageId}/likes`)
    return res.data
}

export const toggleImageLike = async (imageId: string) => {
    const res = await api.post(`/images/${imageId}/like`)
    return res.data
}

export const fetchImageCommentCount = async (imageId: string): Promise<number> => {
	const summary = await commentService.fetchCommentSummary(imageId, 'Image')
	return summary.count
}

export const fetchImageComments = async (imageId: string) => {
	return commentService.fetchComments(imageId, 'Image')
}

export const addImageComment = async (imageId: string, content: string) => {
	return commentService.addComment(imageId, 'Image', content)
}
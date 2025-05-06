// packages/services/src/api/images.ts

import { api } from './http'

export const uploadImage = async (formData: FormData) => api.post('/images/upload', formData)
export const fetchUserImages = async () => api.get('/images').then((res) => res.data)
export const deleteImage = async (imageId: string) => api.delete(`/images/delete/${imageId}`).then((res) => res.data)
// packages/services/src/api/memories.ts

import { api } from './http'
import { RefType, Memory } from '@iam/types'
import { normalizeMemory, normalizeMemories } from '@iam/utils'
import * as commentService from './comments'

export const getAllMemories = async (): Promise<Memory[]> => {
	const res = await api.get('/memories')
	return normalizeMemories(res.data)
}

export const getMemoryById = async (id: string): Promise<Memory> => {
	const res = await api.get<Memory>(`/memories/${id}`)
	return normalizeMemory(res.data)
}

export const createMemory = async (
	content: string,
    date: Date,
	imageId?: string
): Promise<Memory> => {
	const res = await api.post(
		'/memories',
		{ content, date, imageId },
		{ withCredentials: true },
	)
	return res.data
}

export const fetchMemoryLikes = async (memoryId: string) => {
	const res = await api.get(`/memories/${memoryId}/likes`)
	return res.data
}  

export const toggleMemoryLike = async (memoryId: string): Promise<Memory> => {
	const res = await api.post(`/memories/${memoryId}/like`, {}, { withCredentials: true })
	return res.data
}

export const updateMemory = async (id: string, content: string, date: Date, imageId?: string): Promise<Memory> => {
	const res = await api.put(`/memories/${id}`, { content, date, imageId }, { withCredentials: true })
	return res.data
}

export const deleteMemoryImage = async (id: string): Promise<Memory> => {
	const res = await api.put(`/memories/${id}/image/delete`, { withCredentials: true })
	return res.data
}

export const deleteMemory = async (id: string): Promise<{ success: boolean }> => {
	const res = await api.delete(`/memories/${id}`, { withCredentials: true })
	return res.data
}

export const fetchMemoryCommentCount = async (memoryId: string): Promise<number> => {
	const summary = await commentService.fetchCommentSummary(memoryId, RefType.Memory)
	return summary.count
}

export const fetchMemoryComments = async (memoryId: string) => {
	return commentService.fetchComments(memoryId, RefType.Memory)
}

export const addMemoryComment = async (memoryId: string, content: string) => {
	return commentService.addComment(memoryId, RefType.Memory, content)
}

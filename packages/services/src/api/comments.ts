// packages/services/src/api/comments.ts

import { api } from './'

export const fetchCommentSummary = async (postId: string): Promise<{ count: number; commentIds: string[] }> => {
	const res = await api.get(`/comments/summary/${postId}`)
	return res.data
}

export const fetchComments = async (postId: string) => {
	const res = await api.get(`/comments/${postId}`)
	return res.data
}

export const addComment = async (postId: string, content: string) => {
	const res = await api.post('/comments', { postId, content })
	return res.data
}

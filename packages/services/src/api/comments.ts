// packages/services/src/api/comments.ts

import { api } from './'
import type { CommentRefType } from '@iam/types'

export const fetchCommentSummary = async (
	refId: string,
	refType: CommentRefType
): Promise<{ count: number; commentIds: string[] }> => {
	const res = await api.get('/comments/summary', {
		params: { refId, refType },
	})
	return res.data
}

export const fetchComments = async (refId: string, refType: CommentRefType) => {
	const res = await api.get('/comments', {
		params: { refId, refType },
	})
	return res.data
}

export const addComment = async (refId: string, refType: CommentRefType, content: string) => {
	const res = await api.post('/comments', { refId, refType, content })
	return res.data
}

export const deleteComment = async (commentId: string) => {
	const res = await api.delete(`/comments/${commentId}`)
	return res.data
}
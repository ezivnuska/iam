// apps/backend/src/services/comment.service.ts

import { Comment } from '../models/comment.model'

export const createComment = async (postId: string, userId: string, content: string) => {
	return Comment.create({ postId, author: userId, content })
}

export const getCommentsForPost = async (postId: string) => {
	return Comment.find({ postId })
		.populate('author', 'username avatar')
		.sort({ createdAt: -1 })
}

export const getCommentSummaryForPost = async (postId: string) => {
	const comments = await Comment.find({ postId }, { _id: 1 }).lean()
	const commentIds = comments.map(c => c._id)
	return {
		count: commentIds.length,
		commentIds,
	}
}

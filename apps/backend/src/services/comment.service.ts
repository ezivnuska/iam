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

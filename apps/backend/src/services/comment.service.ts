// apps/backend/src/services/comment.service.ts

import mongoose from 'mongoose'
import { Comment } from '../models/comment.model'

export const createComment = async (
	refId: string,
	refType: 'Post' | 'Image',
	userId: string,
	content: string
) => {
	const toObjectId = (id: string | mongoose.Types.ObjectId) =>
		typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
	
	return Comment.create({
		refId: toObjectId(refId),
		refType,
		author: toObjectId(userId),
		content,
	})	
}

export const getCommentsForRef = async (
	refId: string,
	refType: 'Post' | 'Image'
) => {
	const refObjectId = new mongoose.Types.ObjectId(refId)
	return Comment.find({ refId: refObjectId, refType })
			.populate('author', 'username avatar')
			.sort({ createdAt: -1 })
}

export const getCommentSummaryForRef = async (
	refId: string,
	refType: 'Post' | 'Image'
) => {
	const refObjectId = new mongoose.Types.ObjectId(refId)
	const comments = await Comment.find({ refId: refObjectId, refType }, { _id: 1 }).lean()
	const commentIds = comments.map((c) => c._id)
	return {
		count: commentIds.length,
		commentIds,
	}
}

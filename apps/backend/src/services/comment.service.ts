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
	
	const newComment = await Comment.create({
		refId: toObjectId(refId),
		refType,
		author: toObjectId(userId),
		content,
	})

    return Comment.findById(newComment._id).populate('author', 'username avatar')
}

export const getCommentsForRef = async (
	refId: string,
	refType: 'Post' | 'Image'
) => {
	const refObjectId = new mongoose.Types.ObjectId(refId)
	return Comment.find({ refId: refObjectId, refType })
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: { path: 'avatar', select: '_id filename variants username' },
        })
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

export const deleteCommentById = async (commentId: string, userId: string): Promise<boolean> => {
	const comment = await Comment.findById(commentId)
    console.log('deleting comment', comment)
	if (!comment || comment.author.toString() !== userId.toString()) {
		return false
	}

	await comment.deleteOne()
	return true
}

// apps/backend/src/controllers/comment.controller.ts

import { Request, Response } from 'express'
import * as commentService from '../services/comment.service'

export const addComment = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user?.id) {
			res.status(401).json({ message: 'Unauthorized' })
			return
		}

		const { refId, refType, content } = req.body
		if (!refId || !refType || !content) {
			res.status(400).json({ message: 'Missing refId, refType, or content' })
			return
		}
		const comment = await commentService.createComment(refId, refType, req.user.id, content)
		res.status(201).json(comment)
	} catch (error) {
		console.error('Error creating comment:', error)
		res.status(500).json({ message: 'Failed to create comment' })
	}
}

export const getComments = async (req: Request, res: Response): Promise<void> => {
	const { refId, refType } = req.query

	if (!refId || !refType) {
		res.status(400).json({ message: 'Missing refId or refType' })
		return
	}

	const comments = await commentService.getCommentsForRef(refId as string, refType as 'Post' | 'Image')
	res.json(comments)
}

export const getCommentSummary = async (req: Request, res: Response): Promise<void> => {
	const { refId, refType } = req.query

	if (!refId || !refType) {
		res.status(400).json({ error: 'refId and refType are required' })
		return
	}

	try {
		const summary = await commentService.getCommentSummaryForRef(refId as string, refType as 'Post' | 'Image')
		res.json(summary)
	} catch (error) {
		console.error('Error fetching comment summary:', error)
		res.status(500).json({ error: 'Failed to get comment summary' })
	}
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user?.id) {
			res.status(401).json({ message: 'Unauthorized' })
            return
		}

		const { commentId } = req.params
		const deleted = await commentService.deleteCommentById(commentId, req.user.id)

		if (!deleted) {
			res.status(403).json({ message: 'Not allowed to delete this comment' })
            return
		}

		res.status(200).json({ success: true })
	} catch (err) {
		console.error('Error deleting comment:', err)
		res.status(500).json({ message: 'Failed to delete comment' })
	}
}

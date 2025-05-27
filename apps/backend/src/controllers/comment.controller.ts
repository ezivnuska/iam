// apps/backend/src/controllers/comment.controller.ts

import { Request, Response } from 'express'
import * as commentService from '../services/comment.service'

export const addComment = async (req: Request, res: Response) => {
	if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	const { postId, content } = req.body
	if (!postId || !content) {
		res.status(400).json({ message: 'Missing postId or content' })
		return
	}

	const comment = await commentService.createComment(postId, req.user.id, content)
	res.status(201).json(comment)
}

export const getComments = async (req: Request, res: Response) => {
	const postId = req.params.postId
	const comments = await commentService.getCommentsForPost(postId)
	res.json(comments)
}

export const getCommentSummary = async (req: Request, res: Response) => {
	const { postId } = req.params

	if (!postId) {
		res.status(400).json({ error: 'postId is required' })
        return
	}

	try {
		const summary = await commentService.getCommentSummaryForPost(postId)
		res.json(summary)
	} catch (error) {
		console.error('Error fetching comment summary:', error)
		res.status(500).json({ error: 'Failed to get comment summary' })
	}
}

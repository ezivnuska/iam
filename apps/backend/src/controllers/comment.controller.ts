// apps/backend/src/controllers/comment.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as commentService from '../services/comment.service'
import type { CommentRefType } from '@iam/types'
import { normalizeComment, normalizeComments } from '@iam/utils'

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

	const { refId, refType, content } = req.body
	if (!refId || !refType || !content) {
		res.status(400).json({ message: 'Missing refId, refType, or content' })
		return
	}

	try {
		const comment = await commentService.createComment(refId, refType, req.user!.id, content)
		res.status(201).json(normalizeComment(comment))
	} catch (err) {
		next(err)
	}
}

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { refId, refType } = req.query

	if (!refId || !refType) {
		res.status(400).json({ message: 'Missing refId or refType' })
		return
	}

	try {
		const comments = await commentService.getCommentsForRef(refId as string, refType as CommentRefType)
		res.status(201).json(normalizeComments(comments))
	} catch (err) {
		next(err)
	}
}

export const getCommentSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { refId, refType } = req.query

	if (!refId || !refType) {
		res.status(400).json({ error: 'refId and refType are required' })
		return
	}

	try {
		const summary = await commentService.getCommentSummaryForRef(refId as string, refType as CommentRefType)
		res.json(summary)
	} catch (err) {
		next(err)
	}
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

	try {
		const { commentId } = req.params
		await commentService.deleteCommentById(commentId, req.user!.id)
		res.status(200).json({ success: true })
	} catch (err) {
		next(err)
	}
}

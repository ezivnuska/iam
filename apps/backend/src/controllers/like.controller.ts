// apps/backend/src/controllers/like.controller.ts

import { RequestHandler } from 'express'
import * as likeService from '../services/like.service'

export const toggleLike: RequestHandler = async (req, res) => {
	const { refId } = req.params
	const { refType } = req.query
    console.log('refType', refType)
	const userId = req.user?.id

	if (!userId) {
		res.status(400).json({ message: 'User ID could not be determined' })
		return
	}

	if (!likeService.isValidRefType(refType)) {
		res.status(400).json({ error: 'Invalid refType' })
		return
	}

	const result = await likeService.toggleLike({ userId, refId, refType })

	res.status(200).json(result)
}

export const getLikes: RequestHandler = async (req, res, next) => {
	const { refId } = req.params
	const { refType } = req.query

	if (!likeService.isValidRefType(refType)) {
		res.status(400).json({ error: 'Invalid refType' })
		return
	}

	const likes = await likeService.getLikes({ refId, refType })
	res.status(200).json(likes)
}

export const getLikeMeta: RequestHandler = async (req, res) => {
	const { refId } = req.params
	const { refType } = req.query
	const userId = req.user?.id

	if (!likeService.isValidRefType(refType)) {
		res.status(400).json({ error: 'Invalid refType' })
		return
	}

	const meta = await likeService.getLikeMeta({ userId, refId, refType })
	res.json(meta)
}

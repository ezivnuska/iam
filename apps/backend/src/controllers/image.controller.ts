// apps/backend/src/controllers/image.controller.ts

import { RequestHandler } from 'express'
import * as imageService from '../services/image.service'
import { Comment } from '../models/comment.model'
import { ensureUser } from '../utils/controller.utils'

// Utility
const ensureUsername = (req: any): string | null => {
	return req.user?.username ?? null
}

export const uploadImage: RequestHandler = async (req, res, next) => {
	try {
		const username = ensureUsername(req)
		if (!username) {
			res.status(401).json({ message: 'Unauthorized' })
			return
		}
		
		if (!req.file?.buffer) {
			res.status(400).json({ message: 'No file uploaded' })
			return
		}

		const savedImage = await imageService.processAndSaveImage({
			fileBuffer: req.file.buffer,
			originalName: req.file.originalname,
			username,
			generateThumbnail: true,
		})

		res.status(200).json(savedImage)
	} catch (err) {
		next(err)
	}
}

export const getImages: RequestHandler = async (req, res, next) => {
	try {
		const username = ensureUsername(req)
		if (!username) {
			res.status(401).json({ message: 'Unauthorized' })
			return
		}

		const images = await imageService.getImagesByUsername(username)
		res.status(200).json(images)
	} catch (err) {
		next(err)
	}
}

export const getUserImages: RequestHandler = async (req, res, next) => {
	try {
		const username = req.params.username
		if (!username) {
			res.status(400).json({ message: 'Username is required' })
			return
		}

		const images = await imageService.getImagesByUsername(username)
		res.status(200).json(images)
	} catch (err) {
		next(err)
	}
}

export const deleteImageController: RequestHandler = async (req, res, next) => {
	try {
		const username = ensureUsername(req)
		if (!username) {
			res.status(401).json({ message: 'Unauthorized' })
			return
		}

		const { imageId } = req.params
		const success = await imageService.deleteImage(imageId, username)

		await Comment.deleteMany({ refId: imageId, refType: 'Image' })

		res.status(200).json({ message: 'Image and variants deleted successfully' })
	} catch (err) {
		next(err)
	}
}

export const getLikes: RequestHandler = async (req, res, next) => {
	try {
		const userId = ensureUser(req, res)
		if (!userId) return

		const likes = await imageService.getImageLikes(req.params.id, userId)
		res.json(likes)
	} catch (err) {
		next(err)
	}
}

export const toggleLike: RequestHandler = async (req, res, next) => {
	try {
		const userId = ensureUser(req, res)
		if (!userId) return

		const image = await imageService.toggleImageLike(userId, req.params.id)
		res.json(image)
	} catch (err) {
		next(err)
	}
}

export const getCommentCount: RequestHandler = async (req, res, next) => {
	try {
		const count = await imageService.getCommentCount(req.params.id)
		res.json({ count })
	} catch (err) {
		next(err)
	}
}

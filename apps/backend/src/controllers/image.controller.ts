// apps/backend/src/controllers/image.controller.ts

import { RequestHandler } from 'express'
import * as imageService from '../services/image.service'
import { Comment } from '../models/comment.model'

export const uploadImage: RequestHandler = async (req, res, next) => {
	try {
		if (!req.file?.buffer) {
			res.status(400).json({ message: 'No file uploaded' })
			return
		}

		const savedImage = await imageService.processAndSaveImage({
			fileBuffer: req.file.buffer,
			originalName: req.file.originalname,
			userId: req.user!.id,
			username: req.user!.username,
			generateThumbnail: true,
		})		

		res.status(200).json(savedImage)
	} catch (err) {
		next(err)
	}
}

const parsePagination = (req: any) => {
	const page = parseInt(req.query.page as string) || 1
	const limit = parseInt(req.query.limit as string) || 12
	return { page, limit }
}

export const getImages: RequestHandler = async (req, res, next) => {
	try {
		const { page, limit } = parsePagination(req)
		const userId = req.params.userId ?? req.user?.id

		if (!userId) {
			res.status(400).json({ message: 'User ID could not be determined' })
			return
		}

		const result = await imageService.getImagesByUserId(userId, page, limit)
		res.status(200).json(result)
	} catch (err) {
		next(err)
	}
}

export const deleteImageController: RequestHandler = async (req, res, next) => {
	try {
		const { imageId } = req.params
		await imageService.deleteImage(imageId, req.user!.id)

		await Comment.deleteMany({ refId: imageId, refType: 'Image' })

		res.status(200).json({ message: 'Image and variants deleted successfully' })
	} catch (err) {
		next(err)
	}
}

export const getLikes: RequestHandler = async (req, res, next) => {
	try {
		const likes = await imageService.getImageLikes(req.params.id, req.user?.id)
		res.json(likes)
	} catch (err) {
		next(err)
	}
}

export const toggleLike: RequestHandler = async (req, res, next) => {
	try {
		const image = await imageService.toggleImageLike(req.user!.id, req.params.id)
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

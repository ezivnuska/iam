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
			username: req.user!.username,
			generateThumbnail: true,
		})

		res.status(200).json(savedImage)
	} catch (err) {
		next(err)
	}
}

export const getImages: RequestHandler = async (req, res, next) => {
	try {
		const images = await imageService.getImagesByUsername(req.user!.username)
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
		const { imageId } = req.params
		await imageService.deleteImage(imageId, req.user!.username)

		await Comment.deleteMany({ refId: imageId, refType: 'Image' })

		res.status(200).json({ message: 'Image and variants deleted successfully' })
	} catch (err) {
		next(err)
	}
}

export const getLikes: RequestHandler = async (req, res, next) => {
    console.log('req.params', req.params)
	try {
		const likes = await imageService.getImageLikes(req.params.id, req.user!.id)
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

// apps/backend/src/controllers/image.controller.ts

import path from 'path'
import { Request, Response } from 'express'
import fs from 'fs/promises'
import {
	getImagesByUsername,
	processAndSaveImage,
	deleteImage,
} from '../services/image.service'
import { ImageModel } from '../models/image.model'
import { getUserDir } from '../utils/imagePaths'

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
	try {
		const username = req.user?.username
		if (!username) {
			res.status(400).json({ message: 'Username is required' })
			return
		}

		if (!req.file || !req.file.buffer) {
			res.status(400).json({ message: 'No file uploaded' })
			return
		}

		const savedImage = await processAndSaveImage({
			fileBuffer: req.file.buffer,
			originalName: req.file.originalname,
			username,
			generateThumbnail: true,
		})
        
		res.status(200).json(savedImage)
	} catch (err) {
		console.error('Error uploading image:', err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

export const getImages = async (req: Request, res: Response): Promise<void> => {
	try {
		const username = req.user?.username
		if (!username) {
			res.status(400).json({ message: 'Username is required' })
			return
		}

		const images = await getImagesByUsername(username)
		res.status(200).json(images)
	} catch (err) {
		console.error('Failed to fetch images:', err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

export const deleteImageController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { imageId } = req.params
		const username = req.user?.username

		if (!username) {
			res.status(400).json({ message: 'Username is required' })
			return
		}

		const imageDoc = await ImageModel.findOne({ _id: imageId, username })

		if (!imageDoc) {
			res.status(404).json({ message: 'Image not found' })
			return
		}

		const userDir = getUserDir(username)
		const originalPath = path.join(userDir, imageDoc.filename)
		const thumbnailPath = path.join(userDir, `thumb-${imageDoc.filename}`)

		// Delete original and thumbnail files if they exist
		await Promise.allSettled([
			fs.unlink(originalPath),
			fs.unlink(thumbnailPath),
		])

		// Delete image from DB
		await ImageModel.deleteOne({ _id: imageId })

		res.status(200).json({ message: 'Image and thumbnail deleted successfully' })
	} catch (err) {
		console.error('Error deleting image:', err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

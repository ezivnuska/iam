// apps/backend/src/controllers/image.controller.ts

import { Request, Response } from 'express'
import {
	getImagesByUsername,
	processAndSaveImage,
	deleteImage,
} from '../services/image.service'

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

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
	try {
		const username = req.user?.username
		if (!username) {
			res.status(400).json({ message: 'Username is required' })
			return
		}

		if (!req.file) {
			res.status(400).json({ message: 'No file uploaded' })
			return
		}

		const savedImage = await processAndSaveImage({
			fileBuffer: req.file.buffer,
			originalName: req.file.originalname,
			username,
		})

		res.status(200).json(savedImage)
	} catch (err) {
		console.error('Error uploading image:', err)
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

		const isDeleted = await deleteImage(imageId, username)

		if (isDeleted) {
			res.status(200).json({ message: 'Image deleted successfully' })
		} else {
			res.status(404).json({ message: 'Image not found or could not be deleted' })
		}
	} catch (err) {
		console.error('Error deleting image:', err)
		res.status(500).json({ message: 'Internal server error' })
	}
}
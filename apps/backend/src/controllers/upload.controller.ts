// apps/backend/src/controllers/upload.controller.ts

import { Request, Response } from 'express'
import { createImage } from '../services/image.service'

interface MulterRequest extends Request {
	file: Express.Multer.File
}

export const uploadImage = async (req: MulterRequest, res: Response) => {
	try {
		const { username, alt } = req.body

		if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' })
		}

		const image = await createImage({
		filename: req.file.filename,
		username,
		alt,
		})

		res.status(201).json({
		message: 'Image uploaded successfully',
		image: image.toJSON(),
		})
	} catch (error) {
		console.error('Upload failed:', error)
		res.status(500).json({ error: 'Image upload failed' })
	}
}
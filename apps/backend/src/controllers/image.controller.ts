// apps/backend/src/controllers/image.controller.ts

import { Request, Response } from 'express'
import * as imageService from '../services/image.service'
import { ensureAuth } from '../utils/ensureAuth'
import { Comment } from '../models/comment.model'

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

		const savedImage = await imageService.processAndSaveImage({
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

		const images = await imageService.getImagesByUsername(username)
		res.status(200).json(images)
	} catch (err) {
		console.error('Failed to fetch images:', err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

export const getUserImages = async (req: Request, res: Response): Promise<void> => {
	try {
		const username = req.params?.username
		if (!username) {
			res.status(400).json({ message: 'Username is required' })
			return
		}

		const images = await imageService.getImagesByUsername(username)
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

		const success = await imageService.deleteImage(imageId, username)

		if (!success) {
			res.status(404).json({ message: 'Image or files not found' })
			return
		}

        // 🧹 Delete all comments tied to this image
		await Comment.deleteMany({ refId: imageId, refType: 'Image' })

		res.status(200).json({ message: 'Image and variants deleted successfully' })
	} catch (err) {
		console.error('Error deleting image:', err)
		res.status(500).json({ message: 'Internal server error' })
	}
}

export const getLikes = async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
        res.status(400).json({ message: 'userId is required' })
        return
    }
    try {
        const likes = await imageService.getImageLikes(req.params.id, userId)
        if (!likes) {
            res.status(404).json({ message: 'Image not found' })
            return
        }
        res.json(likes)
    } catch (err) {
        console.error('Get likes error:', err)
        res.status(500).json({ message: 'Failed to get image likes' })
    }
}

export const toggleLike = async (req: Request, res: Response) => {
    const userId = ensureAuth(req, res)
    if (!userId) return

    try {
        const image = await imageService.toggleImageLike(userId, req.params.id)
        if (!image) {
            res.status(404).json({ message: 'Image not found' })
            return
        }
        res.json(image)
    } catch (err) {
        console.error('Toggle like error:', err)
        res.status(500).json({ message: 'Failed to toggle like' })
    }
}

export const getCommentCount = async (req: Request, res: Response) => {
    try {
        const count = await imageService.getCommentCount(req.params.id)

        if (count === null || count === undefined) {
            res.status(404).json({ message: 'Image not found' })
            return
        }

        res.json({ count })
    } catch (err) {
        console.error('Error fetching comment count:', err)
        res.status(500).json({ message: 'Failed to fetch comment count' })
    }
}

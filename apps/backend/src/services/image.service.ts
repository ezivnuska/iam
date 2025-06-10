// apps/backend/src/services/image.service.ts

import mongoose from 'mongoose'
import sharp from 'sharp'
import path from 'path'
import { ImageModel } from '../models/image.model'
import { Comment } from '../models/comment.model'
import { sanitizeUsername, ensureDir, deleteFile } from '../utils/file'
import { getUserDir } from '../utils/imagePaths'
import type { ImageVariant } from '@iam/types'
import { HttpError } from '../utils/HttpError'

const VARIANT_SIZES = {
	sm: 300,
	md: 600,
	lg: 900,
	thumb: 150,
} as const

export const getImagesByUsername = async (username: string) => {
	return ImageModel.find({ username }).sort({ createdAt: -1 })
}

export const deleteImage = async (imageId: string, username: string): Promise<boolean> => {
	const image = await ImageModel.findById(imageId)
	if (!image) throw new HttpError('Image not found', 404)
	if (image.username !== username) throw new HttpError('Unauthorized: image does not belong to user', 403)

	const uploadDir = getUserDir(username)

	const deleteResults = await Promise.all(
		image.variants.map(variant =>
			deleteFile(path.join(uploadDir, variant.filename)).catch(() => false)
		)
	)

	await ImageModel.deleteOne({ _id: imageId })

	return deleteResults.some(Boolean)
}

interface ProcessImageParams {
	fileBuffer: Buffer
	originalName: string
	username: string
	alt?: string
	generateThumbnail?: boolean
}

export const processAndSaveImage = async ({
	fileBuffer,
	originalName,
	username,
	alt = '',
	generateThumbnail = false,
}: ProcessImageParams) => {
	const sanitizedUsername = sanitizeUsername(username)
	const uploadDir = getUserDir(sanitizedUsername)
	await ensureDir(uploadDir)

	const filenameBase = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`
	const variants: ImageVariant[] = []

	const originalMetadata = await sharp(fileBuffer).metadata()
	if (!originalMetadata.width || !originalMetadata.height) {
		throw new HttpError('Could not determine original image dimensions', 400)
	}

	for (const [size, width] of Object.entries(VARIANT_SIZES)) {
		if (size === 'thumb' && !generateThumbnail) continue
		if (originalMetadata.width <= width) continue

		const variantFilename = `${size}-${filenameBase}`
		const outputPath = path.join(uploadDir, variantFilename)

		await sharp(fileBuffer)
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: size === 'thumb' ? 50 : 80 })
			.toFile(outputPath)

		const resizedMetadata = await sharp(outputPath).metadata()
		if (!resizedMetadata.width || !resizedMetadata.height) {
			throw new HttpError(`Missing resized dimensions for ${size} variant`, 500)
		}

		variants.push({
			size,
			filename: variantFilename,
			width: resizedMetadata.width,
			height: resizedMetadata.height,
		})
	}

	return ImageModel.create({
		filename: filenameBase,
		username: sanitizedUsername,
		alt,
		variants,
	})
}

export const getImageLikes = async (imageId: string, userId?: string) => {
	const image = await ImageModel.findById(imageId)
	if (!image) throw new HttpError('Image not found', 404)
    
    let likedByCurrentUser = false
    if (userId) {
        const userObjectId = new mongoose.Types.ObjectId(userId)
        likedByCurrentUser = image.likes.some(id => id.equals(userObjectId))
    }

	return {
		likedByCurrentUser,
		count: image.likes.length,
	}
}

export const toggleImageLike = async (userId: string, imageId: string) => {
	const image = await ImageModel.findById(imageId)
	if (!image) throw new HttpError('Image not found', 404)

	const userObjectId = new mongoose.Types.ObjectId(userId)
	const index = image.likes.findIndex(id => id.equals(userObjectId))

	if (index >= 0) {
		image.likes.splice(index, 1)
	} else {
		image.likes.push(userObjectId)
	}

	await image.save()

	return {
		likedByCurrentUser: image.likes.some(id => id.equals(userObjectId)),
		count: image.likes.length,
	}
}

export const getCommentCount = async (imageId: string) => {
	const imageExists = await ImageModel.exists({ _id: imageId })
	if (!imageExists) throw new HttpError('Image not found', 404)

	return Comment.countDocuments({
		parentId: imageId,
		parentType: 'Image',
	})
}

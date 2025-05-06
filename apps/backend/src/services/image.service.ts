// app/backend/src/services/image.service.ts

import sharp from 'sharp'
import path from 'path'
import { Image } from '../models/image.model'
import {
	sanitizeUsername,
	getUserDir,
	ensureDir,
	deleteFile,
} from '../utils/file'

export const deleteImageFile = async (filename: string, username: string): Promise<boolean> => {
	const imagePath = path.join(getUserDir(username), filename)
	return await deleteFile(imagePath)
}

export const deleteImageMetadata = async (imageId: string): Promise<void> => {
	await Image.deleteOne({ _id: imageId })
}

export const deleteImage = async (imageId: string, username: string): Promise<boolean> => {
	const image = await Image.findById(imageId)
	if (!image) throw new Error('Image not found')
	if (image.username !== username) throw new Error('You can only delete your own images')

	const fileDeleted = await deleteImageFile(image.filename, image.username)

	if (fileDeleted) {
		await deleteImageMetadata(imageId)
		return true
	}
	return false
}

export const processAndSaveImage = async ({
	fileBuffer,
	originalName,
	username,
	alt = '',
}: {
	fileBuffer: Buffer
	originalName: string
	username: string
	alt?: string
}) => {
	const sanitizedUsername = sanitizeUsername(username)
	const uploadDir = getUserDir(sanitizedUsername)
	await ensureDir(uploadDir)

	const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`
	const outputPath = path.join(uploadDir, filename)

	const imageSharp = sharp(fileBuffer).resize(800).webp({ quality: 80 })
	const { width = 0, height = 0 } = await imageSharp.metadata()
	await imageSharp.toFile(outputPath)

	return await Image.create({
		filename,
		username: sanitizedUsername,
		width,
		height,
		alt,
	})
}

export const getImagesByUsername = async (username: string) => {
	return await Image.find({ username }).sort({ createdAt: -1 })
}
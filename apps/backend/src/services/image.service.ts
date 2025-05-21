// apps/backend/src/services/image.service.ts

import sharp from 'sharp'
import path from 'path'
import { ImageModel } from '../models/image.model'
import { sanitizeUsername, ensureDir, deleteFile } from '../utils/file'
import { getUserDir } from '../utils/imagePaths'
import type { ImageVariant } from '@iam/types'

export const getImagesByUsername = async (username: string) => {
	return await ImageModel.find({ username }).sort({ createdAt: -1 })
}

export const deleteImage = async (imageId: string, username: string): Promise<boolean> => {
	const image = await ImageModel.findById(imageId)
	if (!image) throw new Error('Image not found')
	if (image.username !== username) throw new Error('You can only delete your own images')

	const uploadDir = getUserDir(image.username)

	const deleteResults = await Promise.all(
		image.variants.map(variant =>
			deleteFile(path.join(uploadDir, variant.filename)).catch(() => false)
		)
	)

	await ImageModel.deleteOne({ _id: imageId })

	return deleteResults.some(result => result)
}

export const processAndSaveImage = async ({
	fileBuffer,
	originalName,
	username,
	alt = '',
	generateThumbnail = false,
}: {
	fileBuffer: Buffer
	originalName: string
	username: string
	alt?: string
	generateThumbnail?: boolean
}) => {
	const VARIANTS = {
		sm: 300,
		md: 600,
		lg: 900,
		thumb: 150,
	}

	const sanitizedUsername = sanitizeUsername(username)
	const uploadDir = getUserDir(sanitizedUsername)
	await ensureDir(uploadDir)

	const filenameBase = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`
	const variants: ImageVariant[] = []

	for (const [size, width] of Object.entries(VARIANTS)) {
		if (size === 'thumb' && !generateThumbnail) continue

		const variantFilename = `${size}-${filenameBase}`
		const outputPath = path.join(uploadDir, variantFilename)

		const resizedSharp = sharp(fileBuffer).resize(width).webp({ quality: size === 'thumb' ? 50 : 80 })
		const metadata = await resizedSharp.metadata()
		await resizedSharp.toFile(outputPath)

		variants.push({
			size,
			filename: variantFilename,
			width: metadata.width || 0,
			height: metadata.height || 0,
		})
	}

	return await ImageModel.create({
		filename: filenameBase,
		username: sanitizedUsername,
		alt,
		variants,
	})
}

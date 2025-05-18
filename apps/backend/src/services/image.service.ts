// apps/backend/src/services/image.service.ts

import sharp from 'sharp'
import path from 'path'
import { ImageModel } from '../models/image.model'
import { sanitizeUsername, ensureDir, deleteFile } from '../utils/file'
import { getUserDir } from '../utils/imagePaths'

export const deleteImageMetadata = async (imageId: string): Promise<void> => {
    await ImageModel.deleteOne({ _id: imageId })
}

export const deleteImageFile = async (filename: string, username: string): Promise<boolean> => {
	const uploadDir = getUserDir(username)

	// Delete original image
	const imagePath = path.join(uploadDir, filename)
	const imageDeleted = await deleteFile(imagePath)

	// Delete thumbnail if exists
	const thumbPath = path.join(uploadDir, `thumb-${filename}`)
	const thumbDeleted = await deleteFile(thumbPath).catch(() => false) // ignore errors if thumb doesn't exist

	return imageDeleted || thumbDeleted
}

export const deleteImage = async (imageId: string, username: string): Promise<boolean> => {
	const image = await ImageModel.findById(imageId)
	if (!image) throw new Error('Image not found')
	if (image.username !== username) throw new Error('You can only delete your own images')

	const filesDeleted = await deleteImageFile(image.filename, image.username)

	if (filesDeleted) {
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
    generateThumbnail = false,
}: {
    fileBuffer: Buffer
    originalName: string
    username: string
    alt?: string
    generateThumbnail?: boolean
}) => {
    const sanitizedUsername = sanitizeUsername(username)
    const uploadDir = getUserDir(sanitizedUsername)
    await ensureDir(uploadDir)
  
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`
    const outputPath = path.join(uploadDir, filename)
  
    const imageSharp = sharp(fileBuffer).resize(600).webp({ quality: 80 })
    const { width = 0, height = 0 } = await imageSharp.metadata()
    await imageSharp.toFile(outputPath)
  
    if (generateThumbnail) {
        const thumbPath = path.join(uploadDir, `thumb-${filename}`)
        await sharp(fileBuffer)
            .resize(200)
            .webp({ quality: 50 })
            .toFile(thumbPath)
    }
  
    return await ImageModel.create({
        filename,
        username: sanitizedUsername,
        width,
        height,
        alt,
    })
}

export const getImagesByUsername = async (username: string) => {
	return await ImageModel.find({ username }).sort({ createdAt: -1 })
}

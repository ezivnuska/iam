// apps/backend/src/middleware/upload.middleware.ts

import { RequestHandler } from 'express'
import multer, { Options } from 'multer'
import path from 'path'
import fs from 'fs'
import { getUserDir } from '../utils/imagePaths'

// === Constants ===
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// === Helpers ===
const sanitizeUsername = (username: string) =>
	username.replace(/[^a-zA-Z0-9_-]/g, '')

const isValidExtension = (ext: string): boolean => ALLOWED_EXTENSIONS.has(ext.toLowerCase())

const ensureDirectoryExists = (dir: string): void => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
}

// === Multer Configuration ===
const diskStorage = multer.diskStorage({
	destination: (req, _file, cb) => {
		try {
            const username = req.user?.username
            if (!username) throw new Error('Missing authenticated username')
            const dir = getUserDir(username)
			ensureDirectoryExists(dir)
			cb(null, dir)
		} catch (err) {
			console.error('Error creating upload directory:', err)
			cb(new Error('Failed to create directory'), '')
		}
	},
	filename: (_req, file, cb) => {
		const ext = path.extname(file.originalname)
		if (!isValidExtension(ext)) {
			console.warn(`Unsupported file extension: ${ext}`)
			return cb(new Error('Unsupported file type'), '')
		}
		const filename = `${Date.now()}${ext}`
		cb(null, filename)
	},
})

const memoryStorage = multer.memoryStorage()

const fileFilter: Options['fileFilter'] = (_req, file, cb) => {
	if (!VALID_MIME_TYPES.includes(file.mimetype)) {
		console.warn(`Rejected file due to MIME type: ${file.mimetype}`)
		return cb(null, false)
	}
	cb(null, true)
}

const limits: Options['limits'] = {
	fileSize: MAX_FILE_SIZE,
}

// Disk-based single image upload
export const uploadDisk = multer({
	storage: diskStorage,
	fileFilter,
	limits,
})

// Memory-based single image upload
export const uploadMemory = multer({
	storage: memoryStorage,
	fileFilter,
	limits,
})

// Disk-based upload with fields
export const uploadDiskFields: RequestHandler = multer({
	storage: diskStorage,
	fileFilter,
	limits,
}).fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'thumbnail', maxCount: 1 },
])

// Memory-based upload with fields
export const uploadMemoryFields: RequestHandler = multer({
	storage: memoryStorage,
	fileFilter,
	limits,
}).fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'thumbnail', maxCount: 1 },
])
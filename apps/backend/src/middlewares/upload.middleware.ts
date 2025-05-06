// apps/backend/src/middlewares/upload.middleware.ts

import multer, { Options } from 'multer'
import path from 'path'
import fs from 'fs'

// === Constants ===
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const IMAGE_DIR_ROOT = path.resolve(__dirname, '../../../images/users')
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// === Helpers ===
const sanitizeUsername = (username: string) =>
	username.replace(/[^a-zA-Z0-9_-]/g, '')

const getUserDir = (username: string): string => {
	const safeUsername = sanitizeUsername(username || 'unknown')
	return path.join(IMAGE_DIR_ROOT, safeUsername)
}

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
			const dir = getUserDir(req.body.username)
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

// === Exported Upload Middleware ===
export const uploadDisk = multer({
	storage: diskStorage,
	fileFilter,
	limits,
})

export const uploadMemory = multer({
	storage: memoryStorage,
	fileFilter,
	limits,
})
// apps/backend/src/utils/file.ts

import { promises as fs } from 'fs'

/**
 * Sanitizes a username for safe filesystem paths.
 */
export const sanitizeUsername = (username: string): string =>
	username.replace(/[^a-zA-Z0-9_-]/g, '')

/**
 * Ensures a directory exists. Creates it recursively if not present.
 */
export const ensureDir = async (dirPath: string) => {
	await fs.mkdir(dirPath, { recursive: true })
}

/**
 * Deletes a file if it exists.
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
	try {
		await fs.unlink(filePath)
		return true
	} catch (err: any) {
		if (err.code === 'ENOENT') return false // File doesn't exist
		throw err
	}
}
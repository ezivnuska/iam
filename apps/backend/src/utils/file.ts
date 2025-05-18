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
export const ensureDir = async (dirPath: string): Promise<void> => {
	await fs.mkdir(dirPath, { recursive: true })
}

/**
 * Deletes a file if it exists.
 * Returns true if the file was deleted,
 * false if it didn't exist,
 * otherwise throws the error.
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
	try {
		await fs.unlink(filePath)
		return true
	} catch (err: unknown) {
		if (
			err &&
			typeof err === 'object' &&
			'code' in err &&
			(err as { code?: string }).code === 'ENOENT'
		) {
			// File doesn't exist
			return false
		}
		throw err
	}
}
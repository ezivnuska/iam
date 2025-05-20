// apps/backend/src/utils/file.ts

import { promises as fs } from 'fs'

export const sanitizeUsername = (username: string): string =>
	username.replace(/[^a-zA-Z0-9_-]/g, '')

export const ensureDir = async (dirPath: string): Promise<void> => {
	await fs.mkdir(dirPath, { recursive: true })
}

export async function deleteFile(filePath: string): Promise<boolean> {
	try {
		await fs.unlink(filePath)
		return true
	} catch (err: any) {
        console.warn(`File not found: ${filePath}`)
		if (err.code === 'ENOENT') {
			return false
		}
		throw err
	}
}

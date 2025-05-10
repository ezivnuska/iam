// apps/backend/src/utils/imagePaths.ts
import path from 'path'
import { sanitizeUsername } from './file'

const PROJECT_ROOT = path.resolve(__dirname, '../../../../')
const rawUploadDir = process.env.IMAGE_UPLOAD_DIR || 'apps/images/users'
const IMAGE_UPLOAD_ROOT = path.isAbsolute(rawUploadDir)
  ? rawUploadDir
  : path.resolve(PROJECT_ROOT, rawUploadDir)

export const getUserDir = (username: string): string => {
	const safeUsername = sanitizeUsername(username)
	return path.join(IMAGE_UPLOAD_ROOT, safeUsername)
}
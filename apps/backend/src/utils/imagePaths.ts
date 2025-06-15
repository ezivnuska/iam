// apps/backend/src/utils/imagePaths.ts

import path from 'path'
import { sanitizeUsername } from './file'

const PROJECT_ROOT = path.resolve(__dirname, '../../../../')
console.log('PROJECT_ROOT', PROJECT_ROOT)
console.log('IMAGE_UPLOAD_DIR', process.env.IMAGE_UPLOAD_DIR)
const rawUploadDir = process.env.IMAGE_UPLOAD_DIR || 'apps/images/users'
const IMAGE_UPLOAD_ROOT = path.isAbsolute(rawUploadDir)
  ? rawUploadDir
  : path.resolve(PROJECT_ROOT, rawUploadDir)

export const getUserDir = (username: string): string => {
	const safeUsername = sanitizeUsername(username)
    const userDir = path.join(IMAGE_UPLOAD_ROOT, safeUsername)
    console.log('userDir', userDir)
	return userDir
}
// apps/backend/src/types/express.d.ts

import type { TokenPayload } from '@auth'
import type { File as MulterFile } from 'multer'

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload
			file?: MulterFile
			files?: MulterFile[]
		}
	}
}

export {}
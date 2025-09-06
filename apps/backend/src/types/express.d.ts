// apps/backend/src/types/express.d.ts

import type { TokenPayload } from '@iam/auth'
import type { File as MulterFile } from 'multer'

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload
            refreshToken?: string
            clientType?: string
			file?: MulterFile
			files?: MulterFile[]
		}
	}
}

export {}
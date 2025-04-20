// apps/backend/src/types/express.d.ts

import { User } from '@types/user'

import type { TokenPayload } from '@auth'

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload
		}
	}
}

export {}
// apps/backend/src/types/express/index.d.ts

import { IUser } from '../../models/user.model'

declare global {
	namespace Express {
		interface Request {
			user?: Partial<IUser> & { _id: string }
		}
	}
}

export {}
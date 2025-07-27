// apps/backend/src/middleware/optionalAuth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { verifyToken } from '@iam/auth'

export const optionalAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization

	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader.split(' ')[1]
		try {
			const payload = verifyToken(token)
			req.user = payload
		} catch (err) {
			console.log('Error: Invalid token', err)
		}
	}

	next()
}

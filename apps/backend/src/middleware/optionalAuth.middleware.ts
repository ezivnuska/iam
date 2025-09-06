// apps/backend/src/middleware/optionalAuth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { verifyToken } from '@iam/auth'

export const optionalAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
	// try Authorization header first for native clients
	let token = req.headers.authorization?.startsWith('Bearer ')
		? req.headers.authorization.split(' ')[1]
		: undefined

	// fallback to cookie for web clients
	if (!token && req.cookies?.accessToken) {
		token = req.cookies.accessToken
	}

	// verify token if present
	if (token) {
		try {
			const payload = verifyToken(token)
			req.user = payload
		} catch (err) {
			console.log('Optional auth: Invalid token', err)
		}
	}

	next()
}

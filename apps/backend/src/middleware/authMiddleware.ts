// apps/backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { TokenPayload, verifyToken } from '@auth'

export const requireAuth = (roles: TokenPayload['role'][] = []): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Unauthorized' })
			return
		}

		const token = authHeader.split(' ')[1]

		try {
			const payload = verifyToken(token)

			if (roles.length && !roles.includes(payload.role)) {
				res.status(403).json({ message: 'Forbidden: Access denied' })
				return
			}

			req.user = payload

			next()
		} catch (err) {
			res.status(403).json({ message: 'Invalid or expired token' })
		}
	}
}
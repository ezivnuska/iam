// /middlewares/authMiddleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthPayload {
  _id: string
  email: string
  username: string
  role: string
}

export const requireAuth = (roles: string[] = []): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Unauthorized' })
			return
		}

		const token = authHeader.split(' ')[1]

		try {
			const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload
			if (!decoded._id) throw new Error('Invalid token')

			if (roles.length > 0 && !roles.includes(decoded.role)) {
				res.status(403).json({ message: 'Forbidden: Access denied' })
				return
			}

			next()
		} catch (err) {
			res.status(403).json({ message: 'Invalid or expired token' })
		}
	}
}
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthenticatedRequest extends Request {
	user?: any
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	const token = authHeader.split(' ')[1]

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		req.user = decoded
		next()
	} catch (err) {
		return res.status(403).json({ message: 'Invalid or expired token' })
	}
}

export const requireRole = (role: string) => {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		if (!req.user || req.user.role !== role) {
			return res.status(403).json({ message: 'Forbidden: Access denied' })
		}
		next()
	}
}
// apps/backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Socket } from 'socket.io'
import { TokenPayload, verifyToken } from '@auth'

export const requireAuth = (roles: TokenPayload['role'][] = []): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const authHeader = req.headers.authorization

		if (!authHeader?.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Unauthorized: Missing token' })
			return
		}

		const token = authHeader.split(' ')[1]

		try {
			const payload = verifyToken(token)

			if (!payload?.id) {
				res.status(401).json({ message: 'Unauthorized: Invalid token payload' })
				return
			}

			if (roles.length && !roles.includes(payload.role)) {
				res.status(403).json({ message: 'Forbidden: Access denied' })
				return
			}

			req.user = payload
			next()
		} catch (err) {
			res.status(401).json({ message: 'Invalid or expired token' })
		}
	}
}

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
	const token = socket.handshake.auth?.token

	if (!token) {
		return next(new Error('Unauthorized: Missing token'))
	}

	try {
		const payload = verifyToken(token)

		if (!payload?.id) {
			return next(new Error('Unauthorized: Invalid token payload'))
		}

		// Attach user to the socket
		socket.data.user = payload
		next()
	} catch (err) {
		next(new Error('Invalid or expired token'))
	}
}

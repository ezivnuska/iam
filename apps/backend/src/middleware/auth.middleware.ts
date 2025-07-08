// apps/backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Socket } from 'socket.io'
import { TokenPayload, verifyToken } from '@auth'
import { ImageDocument, SocketUser } from '@iam/types'
import { findUserById } from '../services/user.service'
import { normalizeSocketImage } from '@utils'

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

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
	const token = socket.handshake.auth?.token

	if (!token) return next(new Error('Unauthorized: Missing token'))

	try {
		const payload = verifyToken(token)
		if (!payload?.id) return next(new Error('Unauthorized: Invalid token payload'))

		const user = await findUserById(payload.id)
		if (!user) {
			console.warn(`No user data found for socket ${socket.id}`)
			return
		}

		const socketUser: SocketUser = {
			id: user._id.toString(),
			username: user.username,
			role: user.role,
			avatar: normalizeSocketImage(user.avatar as ImageDocument),
		}			

		socket.data.user = socketUser
		next()
	} catch (err) {
		next(new Error('Invalid or expired token'))
	}
}

// apps/backend/src/middleware/requireRefreshToken.ts

import { Request, Response, NextFunction } from 'express'
import { verifyToken, TokenPayload } from '@auth'

export const requireRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.cookies?.refreshToken

	if (!token) {
		res.status(401).json({ message: 'Missing refresh token cookie' })
		return
	}

	try {
		const payload = verifyToken(token)
		req.user = payload as TokenPayload
		next()
	} catch (err) {
		res.status(403).json({ message: 'Invalid or expired refresh token' })
	}
}

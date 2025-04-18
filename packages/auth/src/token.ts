import jwt from 'jsonwebtoken'
import type { TokenPayload } from '@types'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

export const generateToken = (user: TokenPayload): string => {
	return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' })
}

export const verifyToken = (token: string): TokenPayload => {
	return jwt.verify(token, JWT_SECRET) as TokenPayload
}
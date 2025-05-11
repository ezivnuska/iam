// packages/auth/src/token.ts

import jwt, { SignOptions } from 'jsonwebtoken'
import type { TokenPayload } from './types'

const JWT_SECRET = process.env.JWT_SECRET ?? 'insecure-dev-secret'

const accessOptions: SignOptions = {
	expiresIn: '30m',
}

const refreshOptions: SignOptions = {
	expiresIn: '7d',
}

export const generateToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, JWT_SECRET, accessOptions)
}

export const generateRefreshToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, JWT_SECRET, refreshOptions)
}

export const verifyToken = (token: string): TokenPayload => {
	return jwt.verify(token, JWT_SECRET) as TokenPayload
}
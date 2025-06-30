// packages/auth/src/token.ts

import jwt, { SignOptions } from 'jsonwebtoken'
import type { TokenPayload } from './types'

const JWT_SECRET = process.env.JWT_SECRET ?? 'insecure-dev-secret'

const accessOptions: SignOptions = {
	expiresIn: '2h',
    // or
	// expiresIn: '30m'
	// expiresIn: '12h'
	// expiresIn: '1d'
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
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		return payload as TokenPayload
	} catch (err) {
		console.error('[verifyToken] ERROR verifying token:', err)
		throw err
	}
}
  
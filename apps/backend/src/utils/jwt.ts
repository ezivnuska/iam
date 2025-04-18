import jwt, { Secret, SignOptions } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.JWT_SECRET!
// const JWT_SECRET: Secret = process.env.JWT_SECRET ?? (() => {
// 	throw new Error('JWT_SECRET not set in environment variables')
// })()

export const generateToken = (payload: string | object): string => {
	const options: SignOptions = { expiresIn: '15m' }
	return jwt.sign(payload, JWT_SECRET, options)
}

export const generateRefreshToken = (payload: string | object): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): any => {
	return jwt.verify(token, JWT_SECRET)
}
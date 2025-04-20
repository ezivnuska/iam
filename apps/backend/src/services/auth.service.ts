// apps/backend/src/services/auth.service.ts

import { UserModel } from '../models/user.model'
import { hashPassword, comparePassword } from '../utils/password'
import { createPayload, TokenPayload, generateToken, generateRefreshToken, verifyToken } from '@auth'
import crypto from 'crypto'
import { Request, Response } from 'express'

export const registerUser = async (
	email: string,
	username: string,
	password: string
) => {
	const existing = await UserModel.findOne({ email })
	if (existing) throw new Error('User already exists')

	const hashed = await hashPassword(password)

	const verifyToken = crypto.randomBytes(32).toString('hex')
	const user = new UserModel({
		email,
		username,
		password: hashed,
		verifyToken,
		verifyTokenExpires: Date.now() + 3600000, // 1 hour
	})

	await user.save()

	const payload = createPayload(user)
	const token = generateToken(payload)
	const refreshToken = generateRefreshToken(payload)

	return { token, refreshToken }
}

export const loginUser = async (
	email: string,
	password: string,
	res: Response
) => {
	const user = await UserModel.findOne({ email })
	if (!user) throw new Error('Invalid credentials')

	const match = await comparePassword(password, user.password)
	if (!match) throw new Error('Invalid credentials')
	
	const payload = createPayload(user)
	const accessToken = generateToken(payload)
	const refreshToken = generateRefreshToken(payload)

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	})

	return { accessToken }
}

export const refreshAccessToken = async (
	req: Request,
	res: Response
) => {
	const token = req.cookies.refreshToken
	if (!token) return res.status(401).json({ message: 'No refresh token' })

	try {
		const decoded = verifyToken(token)

		if (typeof decoded !== 'object' || !('_id' in decoded)) {
			throw new Error('Invalid token payload')
		}

		const payload = decoded as TokenPayload
		const accessToken = generateToken(payload)

		return res.json({ accessToken })
	} catch {
		return res.status(403).json({ message: 'Invalid or expired refresh token' })
	}
}

export const verifyEmailToken = async (
	req: Request,
	res: Response,
) => {
	const { token } = req.query
	const user = await UserModel.findOne({
		verifyToken: token,
		verifyTokenExpires: { $gt: Date.now() }
	})

	if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

	user.verified = true
	user.verifyToken = undefined
	user.verifyTokenExpires = undefined
	await user.save()

	res.json({ message: 'Email verified' })
}

export const forgotPassword = async (
	req: Request,
	res: Response
) => {
	const user = await UserModel.findOne({ email: req.body.email })
	if (!user) return res.status(400).json({ message: 'No user' })

	const token = crypto.randomBytes(32).toString('hex')
	user.resetPasswordToken = token
	user.resetPasswordExpires = new Date(Date.now() + 3600000)
	await user.save()

	// TODO: send email with reset URL
	res.json({ message: 'Reset email sent' })
}

export const resetPassword = async (
	req: Request,
	res: Response
) => {
	const user = await UserModel.findOne({
		resetPasswordToken: req.body.token,
		resetPasswordExpires: { $gt: Date.now() }
	})

	if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

	user.password = await hashPassword(req.body.newPassword)
	user.resetPasswordToken = undefined
	user.resetPasswordExpires = undefined
	await user.save()

	res.json({ message: 'Password reset successful' })
}
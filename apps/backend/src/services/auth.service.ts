// apps/backend/src/services/auth.service.ts

import { User } from '../models/user.model'
import jwt from 'jsonwebtoken'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken, generateRefreshToken } from '../utils/jwt'
import crypto from 'crypto'

export const registerUser = async (email: string, username: string, password: string) => {
	const existing = await User.findOne({ email })
	if (existing) throw new Error('User already exists')

	const hashed = await hashPassword(password)

	const verifyToken = crypto.randomBytes(32).toString('hex')
	const user = new User({
		email,
		username,
		password: hashed,
		verifyToken,
		verifyTokenExpires: Date.now() + 3600000
	})

	await user.save()
	// TODO: send email with link

	const token = generateToken({ _id: user._id, email, role: user.role })
	const refreshToken = generateRefreshToken({ _id: user._id, email, role: user.role })

	return { token, refreshToken }
}

export const loginUser = async (email: string, password: string, res: any) => {
	const user = await User.findOne({ email })
	if (!user) throw new Error('Invalid credentials')

	const match = await comparePassword(password, user.password)
	if (!match) throw new Error('Invalid credentials')

	const accessToken = generateToken({ _id: user._id, email, role: user.role })
	const refreshToken = generateRefreshToken({ _id: user._id, email, role: user.role })

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60 * 1000
	})

	return { accessToken }
}

export const refreshAccessToken = (req: any, res: any) => {
	const token = req.cookies.refreshToken
	if (!token) return res.status(401).json({ message: 'No refresh token' })

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!)
		const accessToken = generateToken(decoded)
		return res.json({ accessToken })
	} catch {
		return res.status(403).json({ message: 'Invalid refresh token' })
	}
}

export const verifyEmailToken = async (req: any, res: any, next: any) => {
	const { token } = req.query
	const user = await User.findOne({
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

export const forgotPassword = async (req: any, res: any, next: any) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) return res.status(400).json({ message: 'No user' })

	const token = crypto.randomBytes(32).toString('hex')
	user.resetPasswordToken = token
	user.resetPasswordExpires = new Date(Date.now() + 3600000)
	await user.save()

	// TODO: send email with reset URL
	res.json({ message: 'Reset email sent' })
}

export const resetPassword = async (req: any, res: any, next: any) => {
	const user = await User.findOne({
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
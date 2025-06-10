// apps/backend/src/services/auth.service.ts

import { UserModel } from '../models/user.model'
import { hashPassword, comparePassword } from '../utils/password'
import { HttpError } from '../utils/HttpError'
import { createPayload, TokenPayload, generateToken, generateRefreshToken, verifyToken } from '@auth'
import crypto from 'crypto'
import { normalizeUser } from '@utils'

export const registerUser = async (email: string, username: string, password: string) => {
	const existing = await UserModel.findOne({ email })
	if (existing) throw new HttpError('Email already registered', 409)

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

export const loginUser = async (email: string, password: string) => {
	const user = await UserModel.findOne({ email }).select('+password').populate('avatar')
	if (!user) {
		throw new HttpError('Validation failed', undefined, {
			field: 'email',
			issue: 'Email is not registered',
		})
	}

	const isMatch = await comparePassword(password, user.password)
	if (!isMatch) {
		throw new HttpError('Validation failed', undefined, {
			field: 'password',
			issue: 'Invalid password',
		})
	}  

	const payload = createPayload(user)
	const accessToken = generateToken(payload)
	const refreshToken = generateRefreshToken(payload)

	return { accessToken, refreshToken, user: normalizeUser(user) }
}

export const refreshAccessToken = async (refreshToken: string) => {
	if (!refreshToken) throw new HttpError('No refresh token provided', 401)

	let decoded: TokenPayload
	try {
		const raw = verifyToken(refreshToken)
		if (typeof raw !== 'object' || !('_id' in raw)) {
			throw new Error('Invalid token payload')
		}
		decoded = raw as TokenPayload
	} catch {
		throw new HttpError('Invalid or expired refresh token', 403)
	}

	const accessToken = generateToken(decoded)
	return { accessToken }
}

export const verifyEmailToken = async (token: string) => {
	const user = await UserModel.findOne({
		verifyToken: token,
		verifyTokenExpires: { $gt: Date.now() },
	})

	if (!user) throw new HttpError('Invalid or expired token', 400)

	user.verified = true
	user.verifyToken = undefined
	user.verifyTokenExpires = undefined
	await user.save()
}

export const forgotPassword = async (email: string) => {
	const user = await UserModel.findOne({ email })
	if (!user) throw new HttpError('No user with that email', 400)

	const token = crypto.randomBytes(32).toString('hex')
	user.resetPasswordToken = token
	user.resetPasswordExpires = new Date(Date.now() + 3600000)
	await user.save()

	// TODO: send email with reset URL
}

export const resetPassword = async (token: string, newPassword: string) => {
	const user = await UserModel.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() },
	})

	if (!user) throw new HttpError('Invalid or expired reset token', 400)

	user.password = await hashPassword(newPassword)
	user.resetPasswordToken = undefined
	user.resetPasswordExpires = undefined
	await user.save()
}

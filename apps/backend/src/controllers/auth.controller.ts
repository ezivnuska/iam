// apps/backend/src/controllers/auth.controller.ts

import { RequestHandler } from 'express'
import * as authService from '../services/auth.service'
import { getUserDir } from '../utils/imagePaths'
import fs from 'fs'
import { ZodError } from 'zod'

const refreshTokenCookieOptions = {
	httpOnly: true,
	sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
	secure: process.env.NODE_ENV === 'production',
	path: '/',
}

export const signup: RequestHandler = async (req, res, next) => {
	try {
		const { email, username, password } = req.body
		const { token, refreshToken } = await authService.registerUser(email, username, password)

		res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
		res.status(201).json({ token })
	} catch (err) {
		if (err instanceof ZodError) {
			res.status(400).json({ error: 'Validation failed', details: err.errors })
			return
		}
		next(err)
	}
}

export const signin: RequestHandler = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const { accessToken, refreshToken, user } = await authService.loginUser(email, password)

		res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
		res.status(200).json({ accessToken, user })
	} catch (err) {
		if (err instanceof ZodError) {
			res.status(400).json({ error: 'Validation failed', details: err.errors })
			return
		}
		next(err)
	}
}

export const refreshToken: RequestHandler = async (req, res, next) => {
	try {
		const token = req.cookies.refreshToken
		const { accessToken } = await authService.refreshAccessToken(token)
		res.json({ accessToken })
	} catch (err) {
		res.clearCookie('refreshToken', refreshTokenCookieOptions)
		next(err)
	}
}

export const logout: RequestHandler = (req, res) => {
    res.clearCookie('refreshToken', refreshTokenCookieOptions)
    res.status(204).send()
}

export const verifyEmail: RequestHandler = async (req, res, next) => {
	try {
		const token = req.query.token as string
		await authService.verifyEmailToken(token)
		res.json({ message: 'Email verified' })
	} catch (err) {
		next(err)
	}
}

export const forgotPassword: RequestHandler = async (req, res, next) => {
	try {
		const { email } = req.body
		await authService.forgotPassword(email)
		res.json({ message: 'Reset email sent' })
	} catch (err) {
		if (err instanceof ZodError) {
			res.status(400).json({ error: 'Validation failed', details: err.errors })
			return
		}
		next(err)
	}
}

export const resetPassword: RequestHandler = async (req, res, next) => {
	try {
		const { token, newPassword } = req.body
		await authService.resetPassword(token, newPassword)
		res.json({ message: 'Password reset successful' })
	} catch (err) {
		if (err instanceof ZodError) {
			res.status(400).json({ error: 'Validation failed', details: err.errors })
			return
		}
		next(err)
	}
}

export const deleteUserFolder = (username: string) => {
	const dir = getUserDir(username)
	fs.rm(dir, { recursive: true, force: true }, (err) => {
		if (err) console.error(`Failed to delete folder for ${username}:`, err)
	})
}

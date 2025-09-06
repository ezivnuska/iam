// apps/backend/src/controllers/auth.controller.ts

import { RequestHandler, CookieOptions } from 'express'
import * as authService from '../services/auth.service'
import { getUserDir } from '../utils/imagePaths'
import fs from 'fs'
import { ZodError } from 'zod'

// Cookie options (shared between signin, signup, refresh, logout)
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
	path: '/',
}

// ---------------- SIGNIN ----------------
export const signin: RequestHandler = async (req, res, next) => {
	try {
		const { email, password, clientType } = req.body
		const { accessToken, refreshToken, user } = await authService.loginUser(email, password)
		if (clientType === 'web') {
			res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
			res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 })
			res.status(200).json({ success: true, user })
			return
		}

		res.status(200).json({ accessToken, refreshToken, user })
	} catch (err) {
		if (err instanceof ZodError) {
			res.status(400).json({ error: 'Validation failed', details: err.errors })
			return
		}
		next(err)
	}
}

// ---------------- SIGNUP ----------------
export const signup: RequestHandler = async (req, res, next) => {
	try {
		const { email, username, password, clientType } = req.body
		const { accessToken, refreshToken, user } = await authService.registerUser(email, username, password)

		if (clientType === 'web') {
			res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
			res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 })
			res.status(201).json({ success: true, user })
			return
		}

		res.status(201).json({ accessToken, refreshToken, user })
	} catch (err) {
		if (err instanceof ZodError) {
			res.status(400).json({ error: 'Validation failed', details: err.errors })
			return
		}
		next(err)
	}
}

// ---------------- REFRESH TOKEN ----------------
export const refreshToken: RequestHandler = async (req, res, next) => {
	try {
		const token = req.cookies?.refreshToken
		if (!token) {
			res.status(401).json({ message: 'Missing refresh token' })
			return
		}

		const { accessToken } = await authService.refreshAccessToken(token)

		// refresh cookie for web
		res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
		res.json({ success: true })
	} catch (err) {
		res.clearCookie('accessToken', cookieOptions)
		res.clearCookie('refreshToken', cookieOptions)
		next(err)
	}
}

// ---------------- LOGOUT ----------------
export const logout: RequestHandler = (req, res) => {
	res.clearCookie('accessToken', cookieOptions)
	res.clearCookie('refreshToken', cookieOptions)
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

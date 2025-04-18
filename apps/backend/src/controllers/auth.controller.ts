// apps/backend/src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, username, password } = req.body
		const result = await authService.registerUser(email, username, password)
		res.status(201).json(result)
	} catch (err) {
		next(err)
	}
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body
		const result = await authService.loginUser(email, password, res)
		res.status(200).json(result)
	} catch (err) {
		next(err)
	}
}

export const refreshToken = (req: Request, res: Response) => {
	authService.refreshAccessToken(req, res)
}

export const logout = (req: Request, res: Response) => {
	res.clearCookie('refreshToken').json({ message: 'Logged out' })
}

export const verifyEmail = (req: Request, res: Response, next: NextFunction) => {
	authService.verifyEmailToken(req, res, next)
}

export const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
	authService.forgotPassword(req, res, next)
}

export const resetPassword = (req: Request, res: Response, next: NextFunction) => {
	authService.resetPassword(req, res, next)
}
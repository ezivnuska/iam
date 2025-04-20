// apps/backend/src/controllers/auth.controller.ts

import { Request, RequestHandler, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'

export const signup: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { email, username, password } = req.body
		const result = await authService.registerUser(email, username, password)
		res.status(201).json(result)
	} catch (err) {
		next(err)
	}
}

export const signin: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { email, password } = req.body
		const result = await authService.loginUser(email, password, res)
		res.status(200).json(result)
	} catch (err) {
		next(err)
	}
}

export const refreshToken: RequestHandler = (req: Request, res: Response) => {
	authService.refreshAccessToken(req, res)
}

export const logout: RequestHandler = (req: Request, res: Response) => {
	res.clearCookie('refreshToken').json({ message: 'Logged out' })
}

export const verifyEmail: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	authService.verifyEmailToken(req, res)
}

export const forgotPassword: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	authService.forgotPassword(req, res)
}

export const resetPassword: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	authService.resetPassword(req, res)
}
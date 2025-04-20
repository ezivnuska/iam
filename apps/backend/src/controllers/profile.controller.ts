// /controllers/profile.controller.ts

import { Request, RequestHandler, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'

export const getProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
	res.json(req.user)
}

export const updateSelf: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (!req.user) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}
	try {
		const userId = req.user.id
		const updates = req.body
		const updatedUser = await userService.updateUserSelf(userId, updates)
		res.json(updatedUser)
	} catch (err) {
		next(err)
	}
}

export const changePassword: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (!req.user) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}
	try {
		const userId = req.user.id
		const { currentPassword, newPassword } = req.body
	
		if (!currentPassword || !newPassword) {
			res.status(400).json({ message: 'Both current and new passwords are required' })
		}
	
		await userService.changeUserPassword(userId, currentPassword, newPassword)
		res.json({ message: 'Password updated successfully' })
	} catch (err) {
		next(err)
	}
}
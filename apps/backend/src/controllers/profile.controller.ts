import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

export const updateSelf = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		const userId = req.user._id
		const updates = req.body
		const updatedUser = await userService.updateUserSelf(userId, updates)
		res.json(updatedUser)
	} catch (err) {
		next(err)
	}
}

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		const userId = req.user._id
		const { currentPassword, newPassword } = req.body
	
		if (!currentPassword || !newPassword) {
			return res.status(400).json({ message: 'Both current and new passwords are required' })
		}
	
		await userService.changeUserPassword(userId, currentPassword, newPassword)
		res.json({ message: 'Password updated successfully' })
	} catch (err) {
		next(err)
	}
}
  
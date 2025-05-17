// /controllers/profile.controller.ts

import { Request, RequestHandler, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'
import { normalizeUser } from '@utils'

export const getProfile: RequestHandler = async (req, res, next) => {
	if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	try {
		const user = await userService.findUserById(req.user.id)
		res.json(normalizeUser(user))
	} catch (err) {
		next(err)
	}
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

export const setAvatarImage = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		res.status(401).json({ message: 'Unauthorized' })
        return 
	}

	try {
		const imageId = (!req.params.imageId || req.params.imageId === 'undefined') ? undefined : req.params.imageId

		const updatedUser = await userService.setAvatarImage(req.user.username, imageId)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

export const clearAvatar: RequestHandler = async (req, res, next) => {
    if (!req.user) {
		res.status(401).json({ message: 'Unauthorized' })
        return 
	}
    
	try {
		const updatedUser = await userService.setAvatarImage(req.user.username, undefined)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

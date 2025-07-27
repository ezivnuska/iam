// apps/backend/src/controllers/profile.controller.ts

import { RequestHandler } from 'express'
import * as userService from '../services/user.service'
import { normalizeUser } from '@iam/utils'

export const getProfile: RequestHandler = async (req, res, next) => {
	try {
		const user = await userService.findUserById(req.user!.id)
		res.json(normalizeUser(user))
	} catch (err) {
		next(err)
	}
}

export const updateSelf: RequestHandler = async (req, res, next) => {
	try {
		const updates = req.body
		const updatedUser = await userService.updateUserSelf(req.user!.id, updates)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

export const changePassword: RequestHandler = async (req, res, next) => {
	const { currentPassword, newPassword } = req.body
	if (!currentPassword || !newPassword) {
		res.status(400).json({ message: 'Both current and new passwords are required' })
		return
	}

	try {
		await userService.changeUserPassword(req.user!.id, currentPassword, newPassword)
		res.json({ message: 'Password updated successfully' })
	} catch (err) {
		next(err)
	}
}

export const setAvatarImage: RequestHandler = async (req, res, next) => {
	try {
		const imageId = (!req.params.imageId || req.params.imageId === 'undefined') ? undefined : req.params.imageId
		const updatedUser = await userService.setAvatarImage(req.user!.username, imageId)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

export const clearAvatar: RequestHandler = async (req, res, next) => {
	try {
		const updatedUser = await userService.clearAvatar(req.user!.username)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

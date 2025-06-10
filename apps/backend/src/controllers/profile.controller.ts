// apps/backend/src/controllers/profile.controller.ts

import { RequestHandler } from 'express'
import * as userService from '../services/user.service'
import { normalizeUser } from '@utils'
import { ensureUser } from '../utils/controller.utils'

export const getProfile: RequestHandler = async (req, res, next) => {
	const userId = ensureUser(req, res)
	if (!userId) return

	try {
		const user = await userService.findUserById(userId)
		res.json(normalizeUser(user))
	} catch (err) {
		next(err)
	}
}

export const updateSelf: RequestHandler = async (req, res, next) => {
	const userId = ensureUser(req, res)
	if (!userId) return

	try {
		const updates = req.body
		const updatedUser = await userService.updateUserSelf(userId, updates)
		res.json(updatedUser)
	} catch (err) {
		next(err)
	}
}

export const changePassword: RequestHandler = async (req, res, next) => {
	const userId = ensureUser(req, res)
	if (!userId) return

	const { currentPassword, newPassword } = req.body
	if (!currentPassword || !newPassword) {
		res.status(400).json({ message: 'Both current and new passwords are required' })
		return
	}

	try {
		await userService.changeUserPassword(userId, currentPassword, newPassword)
		res.json({ message: 'Password updated successfully' })
	} catch (err) {
		next(err)
	}
}

export const setAvatarImage: RequestHandler = async (req, res, next) => {
	const username = req.user?.username
	if (!username) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	try {
		const imageId = (!req.params.imageId || req.params.imageId === 'undefined') ? undefined : req.params.imageId
		const updatedUser = await userService.setAvatarImage(username, imageId)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

export const clearAvatar: RequestHandler = async (req, res, next) => {
	const username = req.user?.username
	if (!username) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	try {
		const updatedUser = await userService.clearAvatar(username)
		res.json(normalizeUser(updatedUser))
	} catch (err) {
		next(err)
	}
}

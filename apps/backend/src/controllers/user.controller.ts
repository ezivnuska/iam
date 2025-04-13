// controllers/user.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await userService.findAllUsers()
		res.json(users)
	} catch (err) {
		next(err)
	}
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await userService.findUserById(req.params.id)
		res.json(user)
	} catch (err) {
		next(err)
	}
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedUser = await userService.updateUser(req.params.id, req.body)
		res.json(updatedUser)
	} catch (err) {
		next(err)
	}
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updated = await userService.changeUserRole(req.params.id, req.body.role)
		res.json(updated)
	} catch (err) {
		next(err)
	}
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await userService.removeUser(req.params.id)
		res.json({ success: true, user: result })
	} catch (err) {
		next(err)
	}
}
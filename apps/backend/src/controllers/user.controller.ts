// apps/backend/src/controllers/user.controller.ts

import { RequestHandler } from 'express'
import * as userService from '../services/user.service'

export const getAllUsers: RequestHandler = async (_req, res, next) => {
	try {
		const users = await userService.findAllUsers()
		res.json(users)
	} catch (err) {
		next(err)
	}
}

export const getUserById: RequestHandler = async (req, res, next) => {
	try {
		const user = await userService.findUserById(req.params.id)
		res.json(user)
	} catch (err) {
		next(err)
	}
}

export const getUserByUsername: RequestHandler = async (req, res, next) => {
	try {
		const user = await userService.findUserByUsername(req.params.username)
		res.json(user)
	} catch (err) {
		next(err)
	}
}

export const updateUser: RequestHandler = async (req, res, next) => {
	try {
		const updatedUser = await userService.updateUser(req.params.id, req.body)
		res.json(updatedUser)
	} catch (err) {
		next(err)
	}
}

export const updateUserRole: RequestHandler = async (req, res, next) => {
	try {
		const updated = await userService.changeUserRole(req.params.id, req.body.role)
		res.json(updated)
	} catch (err) {
		next(err)
	}
}

export const deleteUser: RequestHandler = async (req, res, next) => {
	try {
		const result = await userService.removeUser(req.params.id)
		res.json({ success: true, user: result })
	} catch (err) {
		next(err)
	}
}

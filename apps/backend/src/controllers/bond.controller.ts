// apps/backend/src/controllers/bond.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as bondService from '../services/bond.service'
import { Types } from 'mongoose'

export const createBond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const sender = req.user?.id
		const responder = req.body.responder

		if (!sender || !responder) {
			// Throw HttpError directly to be caught by global error handler
			throw new Error('Responder and sender are required')
		}

		const bond = await bondService.createBond({ sender, responder })
		res.status(201).json(bond)
	} catch (error) {
		next(error)
	}
}

export const updateBondStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.user?.id
		if (!userId) {
			// Unauthorized - throw to error middleware
			throw new Error('Unauthorized')
		}

		const bond = await bondService.updateBondStatus(
			req.params.id,
			{
				confirmed: req.body.confirmed,
				declined: req.body.declined,
				cancelled: req.body.cancelled,
			},
			userId,
		)
		res.status(200).json(bond)
	} catch (error) {
		next(error)
	}
}

export const getUserBonds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId

		if (!Types.ObjectId.isValid(userId)) {
			throw new Error('Invalid user ID')
		}

		const bonds = await bondService.getUserBonds(userId)
		res.status(200).json(bonds)
	} catch (error) {
		next(error)
	}
}

export const deleteBond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const bondId = req.params.id
		await bondService.deleteBond(bondId)
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

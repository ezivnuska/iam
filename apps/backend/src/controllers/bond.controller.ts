// apps/backend/src/controllers/bond.controller.ts

import { Request, Response } from 'express'
import * as bondService from '../services/bond.service'
import { Types } from 'mongoose'

export const createBond = async (req: Request, res: Response): Promise<void> => {
	try {
		const sender = req.user?.id
		const responder = req.body.responder

		if (!sender || !responder) {
			res.status(400).json({ error: 'Responder is required' })
			return
		}

		const bond = await bondService.createBond({ sender, responder })
		res.status(201).json(bond)
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
}

export const updateBondStatus = async (req: Request, res: Response): Promise<void> => {
	if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	try {
		const bond = await bondService.updateBondStatus(
			req.params.id,
			{
				confirmed: req.body.confirmed,
				declined: req.body.declined,
				cancelled: req.body.cancelled,
			},
			req.user.id,
		)
		res.status(200).json(bond)
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
}

export const getUserBonds = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.params.userId

		// Optional: Validate ObjectId format
		if (!Types.ObjectId.isValid(userId)) {
			res.status(400).json({ error: 'Invalid user ID' })
			return
		}

		const bonds = await bondService.getUserBonds(userId)
		res.status(200).json(bonds)
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
}

export const deleteBond = async (req: Request, res: Response): Promise<void> => {
	try {
		const bondId = req.params.id
		await bondService.deleteBond(bondId)
		res.status(204).send()
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
}

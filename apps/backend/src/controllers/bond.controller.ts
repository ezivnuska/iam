// apps/backend/src/controllers/bond.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as bondService from '../services/bond.service'
import { Types } from 'mongoose'
import { Server, Socket } from 'socket.io'
import { bondEvents } from '../events/bond.events'

interface BondStatusUpdatePayload {
	bondId: string
	status: {
		confirmed?: boolean
		declined?: boolean
		cancelled?: boolean
	}
}

export const registerBondHandlers = (io: Server, socket: Socket) => {
	const userId = socket.data.user?.id
	if (!userId) return

	socket.join(userId)

	socket.on('bond:create', async ({ responder }) => {
		try {
			if (!responder) throw new Error('Responder is required')
			const bond = await bondService.createBond({ sender: userId, responder })

			io.to(bond.sender.toString()).emit('bond:created', bond)
			io.to(bond.responder.toString()).emit('bond:created', bond)
		} catch (err) {
			console.error('Socket bond:create error:', err)
			socket.emit('bond:error', 'Unable to create bond')
		}
	})

	socket.on('bond:update', async ({ bondId, status }: BondStatusUpdatePayload) => {
		try {
			const bond = await bondService.updateBondStatus(bondId, status, userId)

			io.to(bond.sender.toString()).emit('bond:updated', bond)
			io.to(bond.responder.toString()).emit('bond:updated', bond)
		} catch (err) {
			console.error('Socket bond:update error:', err)
			socket.emit('bond:error', 'Unable to update bond')
		}
	})

	socket.on('bond:delete', async ({ bondId }) => {
		try {
			const deletedBond = await bondService.deleteBond(bondId)
			io.to(deletedBond.sender.toString()).emit('bond:deleted', deletedBond)
			io.to(deletedBond.responder.toString()).emit('bond:deleted', deletedBond)
		} catch (err) {
			console.error('Socket bond:delete error:', err)
			socket.emit('bond:error', 'Unable to delete bond')
		}
	})
}


export const createBond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const sender = req.user?.id
		const responder = req.body.responder

		if (!sender || !responder) throw new Error('Responder and sender are required')
		
		const bond = await bondService.createBond({ sender, responder })

		bondEvents.emit('bond:created', bond)

		res.status(201).json(bond)
	} catch (error) {
		next(error)
	}
}

export const updateBondStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.user?.id
		if (!userId) throw new Error('Unauthorized')

		const bond = await bondService.updateBondStatus(
			req.params.id,
			{
				confirmed: req.body.confirmed,
				declined: req.body.declined,
				cancelled: req.body.cancelled,
			},
			userId,
		)

		bondEvents.emit('bond:updated', bond)

		res.status(200).json(bond)
	} catch (error) {
		next(error)
	}
}

export const getUserBonds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId

		if (!Types.ObjectId.isValid(userId)) throw new Error('Invalid user ID')

		const bonds = await bondService.getUserBonds(userId)
		res.status(200).json(bonds)
	} catch (error) {
		next(error)
	}
}

export const deleteBond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const bondId = req.params.id
		const bond = await bondService.deleteBond(bondId)

		bondEvents.emit('bond:deleted', bond)

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

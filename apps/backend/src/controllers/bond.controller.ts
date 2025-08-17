// apps/backend/src/controllers/bond.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as bondService from '../services/bond.service'
import { Types } from 'mongoose'
import { Server, Socket } from 'socket.io'
import { bondEvents } from '../events/bond.events'
import { toBond } from '../utils/toBond'

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
			const createdBond = await bondService.createBond({ sender: userId, responder })
            if (createdBond) {
                const serializedBond = toBond(createdBond)
                const { sender, responder } = serializedBond
                io.to(sender).emit('bond:created', serializedBond)
                io.to(responder).emit('bond:created', serializedBond)

            }
		} catch (err) {
			console.error('Socket bond:create error:', err)
			socket.emit('bond:error', 'Unable to create bond')
		}
	})

	socket.on('bond:update', async ({ bondId, status }: BondStatusUpdatePayload) => {
		try {
			const updatedBond = await bondService.updateBondStatus(bondId, status, userId)
            if (updatedBond) {
                const serializedBond = toBond(updatedBond)
                const { sender, responder } = serializedBond
                io.to(sender).emit('bond:updated', serializedBond)
                io.to(responder).emit('bond:updated', serializedBond)

            }
		} catch (err) {
			console.error('Socket bond:update error:', err)
			socket.emit('bond:error', 'Unable to update bond')
		}
	})

	socket.on('bond:delete', async ({ bondId }) => {
		try {
			const deletedBond = await bondService.deleteBond(bondId)
            if (deletedBond) {
                const serializedBond = toBond(deletedBond)
                const { _id, sender, responder } = serializedBond
                io.to(sender).emit('bond:deleted', _id)
                io.to(responder).emit('bond:deleted', _id)
            }
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

		const serializedBond = toBond(bond)

		res.status(201).json(serializedBond)
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

		const serializedBond = toBond(bond)

		bondEvents.emit('bond:updated', serializedBond)

		res.status(200).json(serializedBond)
	} catch (error) {
		next(error)
	}
}

export const getUserBonds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId

		if (!Types.ObjectId.isValid(userId)) throw new Error('Invalid user ID')

		const bonds = await bondService.getUserBonds(userId)

		res.status(200).json(bonds.map(toBond))
	} catch (error) {
		next(error)
	}
}

export const deleteBond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const bondId = req.params.id
		const deletedBond = await bondService.deleteBond(bondId)
		if (deletedBond) {
            const serializedBond = toBond(deletedBond)
            bondEvents.emit('bond:deleted', serializedBond)
        }

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

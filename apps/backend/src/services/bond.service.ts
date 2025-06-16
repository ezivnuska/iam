// apps/backend/src/services/bond.service.ts

import Bond from '../models/bond.model'
import type { IBond } from '@iam/types'
import { Types } from 'mongoose'
import { HttpError } from '../utils/HttpError'

interface BondData {
	sender: Types.ObjectId | string
	responder: Types.ObjectId | string
}

interface StatusUpdate {
	confirmed?: boolean
	declined?: boolean
	cancelled?: boolean
}

/**
 * Creates a new bond document.
 * @param data - The sender and responder IDs
 * @returns The created bond document
 */
export const createBond = async (data: BondData): Promise<IBond> => {
	if (!data.sender || !data.responder) {
		throw new HttpError('Sender and responder are required', 400)
	}

	const bond = new Bond({
		sender: data.sender,
		responder: data.responder,
		actionerId: data.sender,
	})

	return await bond.save()
}

/**
 * Updates bond status flags.
 * @param id - The bond document ID
 * @param statusUpdate - Object with status fields to update
 * @param actionerId - The user who performed the action
 * @returns The updated bond document
 */
export const updateBondStatus = async (
	id: string,
	statusUpdate: StatusUpdate,
	actionerId: Types.ObjectId | string
): Promise<IBond> => {
	if (!Types.ObjectId.isValid(id)) {
		throw new HttpError('Invalid bond ID', 400)
	}

	const bond = await Bond.findById(id)
	if (!bond) throw new HttpError('Bond not found', 404)

	Object.assign(bond, statusUpdate, { actionerId })
	return await bond.save()
}

/**
 * Fetch all bonds related to a user (as sender or responder)
 * @param userId - User's ObjectId or string
 * @returns Array of bond documents
 */
export const getUserBonds = async (
	userId: Types.ObjectId | string
): Promise<IBond[]> => {
	if (!Types.ObjectId.isValid(userId.toString())) {
		throw new HttpError('Invalid user ID', 400)
	}

	return await Bond.find({
		$or: [{ sender: userId }, { responder: userId }],
	})
}

/**
 * Deletes a bond by ID.
 * @param id - The bond document ID
 */
export const deleteBond = async (id: string): Promise<IBond> => {
	if (!Types.ObjectId.isValid(id)) {
		throw new HttpError('Invalid bond ID', 400)
	}
	const bond = await Bond.findById(id)
	if (!bond) throw new HttpError('Bond not found', 404)
	
	const deletedBond = bond
	await bond.deleteOne()

	return deletedBond
}

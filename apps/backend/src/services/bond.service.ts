// apps/backend/src/services/bond.service.ts

import Bond, { IBond } from '../models/bond.model'
import { Types } from 'mongoose'
import { HttpError } from '../utils/HttpError' // Import the HttpError

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
	return await Bond.find({
		$or: [{ sender: userId }, { responder: userId }],
	})
	// .populate('sender responder')
}

/**
 * Deletes a bond by ID.
 * @param id - The bond document ID
 */
export const deleteBond = async (id: string): Promise<void> => {
	const bond = await Bond.findById(id)
	if (!bond) throw new HttpError('Bond not found', 404)
	await bond.deleteOne()
}

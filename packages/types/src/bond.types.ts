// packages/types/src/bond.types.ts

import { Types } from 'mongoose'

export interface Bond {
	_id: string
	sender: string
	responder: string
	confirmed: boolean
	actionerId: string
	createdAt: string
	updatedAt: string
}

export interface IBond extends Document {
	sender: Types.ObjectId
	responder: Types.ObjectId
	confirmed: boolean
	declined: boolean
	cancelled: boolean
	actionerId: Types.ObjectId
	createdAt: Date
	updatedAt: Date
}
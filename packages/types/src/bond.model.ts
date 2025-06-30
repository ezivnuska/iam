// packages/types/src/bond.model.ts

import { Document, Types } from 'mongoose'

export interface IBond extends Document {
    _id: Types.ObjectId
	sender: Types.ObjectId
	responder: Types.ObjectId
	confirmed: boolean
	declined: boolean
	cancelled: boolean
	actionerId: Types.ObjectId
	createdAt: Date
	updatedAt: Date
}

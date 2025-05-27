// apps/backend/src/models/bond.model.ts

import { Schema, model, Document, Types } from 'mongoose'

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

const BondSchema = new Schema<IBond>({
	sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	responder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	confirmed: { type: Boolean, default: false },
	declined: { type: Boolean, default: false },
	cancelled: { type: Boolean, default: false },
	actionerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

const Bond = model<IBond>('Bond', BondSchema)

export default Bond

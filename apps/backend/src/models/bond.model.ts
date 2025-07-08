// apps/backend/src/models/bond.model.ts

import { Schema, model, Types } from 'mongoose'
import type { IBond } from '@iam/types'

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

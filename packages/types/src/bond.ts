// packages/types/src/bond.ts

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

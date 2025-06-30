// apps/backend/src/utils/toBond.ts

import type { Bond, IBond } from '@iam/types'

export const toBond = (bond: IBond): Bond => {
	return {
		_id: bond._id.toString(),
		sender: bond.sender.toString(),
		responder: bond.responder.toString(),
		confirmed: bond.confirmed,
		actionerId: bond.actionerId.toString(),
		createdAt: bond.createdAt.toISOString(),
		updatedAt: bond.updatedAt.toISOString(),
	}
}

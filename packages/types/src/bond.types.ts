// packages/types/src/bond.types.ts

export interface Bond {
	_id: string
	sender: string
	responder: string
	confirmed: boolean
	actionerId: string
	createdAt: string
	updatedAt: string
}
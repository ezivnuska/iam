// packages/types/src/bond.types.ts

import { User } from "./user.types"

export interface Score {
	_id: string
	user: User
	score: string
}
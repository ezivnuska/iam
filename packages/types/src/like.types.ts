// packages/types/src/like.types.ts

import type { RefType } from './ref.types'

export type LikeRefType = RefType

export interface Like {
	id: string
	refId: string
	refType: LikeRefType
	user: {
		id: string
		username: string
		avatarUrl?: string
	}
	createdAt: string
}

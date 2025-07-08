// packages/types/src/comment.ts

import { PartialUser } from './user'

export type Comment = {
	_id: string
	content: string
	author: PartialUser
	createdAt: string
}


// packages/types/src/comment.types.ts

import { PartialUser } from './user.types'
import { RefType } from './ref.types'

export type CommentRefType = RefType

export type Comment = {
	_id: string
	content: string
	author: PartialUser
	createdAt: string
}

// packages/types/src/comment.types.ts

import { Author } from './user.types'
import { RefType } from './ref.types'

export type CommentRefType = RefType

export type Comment = {
	id: string
	content: string
	author: Author
	createdAt: string
}

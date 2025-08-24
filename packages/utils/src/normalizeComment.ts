// packages/utils/src/normalizeComment.ts

import { Comment } from '@iam/types'
import { normalizeAuthor } from './normalizeAuthor'

export function normalizeComment(rawComment: any): Comment {
    return {
        id: rawComment._id?.toString() ?? rawComment.id,
        author: normalizeAuthor(rawComment.author),
        content: rawComment.content,
        createdAt: rawComment.createdAt,
    }
}

export function normalizeComments(rawComments: any[]): Comment[] {
	return rawComments.map(normalizeComment)
}

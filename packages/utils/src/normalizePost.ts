// packages/utils/src/normalizePost.ts

import { Post } from '@iam/types'
import { normalizeUser } from './normalizeUser'

export function normalizePost(rawPost: any): Post {
    return {
        ...rawPost,
        id: rawPost.id ?? rawPost._id,
        author: rawPost.author ? normalizeUser(rawPost.author) : undefined,
    }
}

export function normalizePosts(rawPosts: any[]): Post[] {
	return rawPosts.map(normalizePost)
}

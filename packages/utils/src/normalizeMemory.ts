// packages/utils/src/normalizeMemory.ts

import { Memory, Post } from '@iam/types'
import { normalizeUser } from './normalizeUser'

export function normalizeMemory(rawPost: any): Memory {
    return {
        ...rawPost,
        id: rawPost.id ?? rawPost._id,
        author: rawPost.author ? normalizeUser(rawPost.author) : undefined,
    }
}

export function normalizeMemories(rawMemories: any[]): Memory[] {
	return rawMemories.map(normalizeMemory)
}

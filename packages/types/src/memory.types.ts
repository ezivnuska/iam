// packages/types/src/memory.types.ts

import type { UploadedImage } from './image.types'
import { PartialUser } from './user.types'

export interface Memory {
	id: string
	content: string
	createdAt: string
	updatedAt: string
	author: PartialUser
    likes: string[]
    likedByCurrentUser: boolean
    image?: UploadedImage
    date: Date,
}

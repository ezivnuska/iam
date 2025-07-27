// packages/types/src/post.types.ts

import type { UploadedImage } from './image.types'
import { PartialUser } from './user.types'

export interface Post {
	id: string
	content: string
	createdAt: string
	updatedAt: string
	author: PartialUser
    likes: string[]
    likedByCurrentUser: boolean
    image?: UploadedImage
    linkUrl?: string
	linkPreview?: {
		title?: string
		description?: string
		image?: string
	}
}

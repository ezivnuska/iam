// packages/types/src/like.ts

export interface Like {
	id: string
	refId: string
	refType: 'Post' | 'Image'
	user: {
		id: string
		username: string
		avatarUrl?: string
	}
	createdAt: string
}

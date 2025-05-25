// packages/types/src/comment.ts

export type Comment = {
	_id: string
	content: string
	author: {
		_id: string
		username: string
		avatar?: string
	}
	createdAt: string
}

// packages/types/src/post.ts

export interface Post {
	_id: string
	content: string
	createdAt: string
	updatedAt: string
	user: {
        _id: string
        username: string
        avatar?: {
            filename: string
            variants?: {
                size: string
                filename: string
                width: number
                height: number
            }[]
        }
    }    
}
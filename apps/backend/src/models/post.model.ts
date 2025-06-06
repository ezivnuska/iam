// apps/backend/src/models/post.model.ts

import { Schema, model, Types, Document } from 'mongoose'

export interface IPost extends Document {
    author: Types.ObjectId
    content: string
    likes: Types.ObjectId[]
	likedByCurrentUser?: boolean
}

const postSchema = new Schema<IPost>(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
)

export default model<IPost>('Post', postSchema)

// apps/backend/src/models/post.model.ts

import { Schema, model, Types, Document } from 'mongoose'

export interface IPost extends Document {
    author: Types.ObjectId
    content: string
    likes: Types.ObjectId[]
    image?: Types.ObjectId
    linkUrl?: string
    linkPreview?: {
        title?: string
        description?: string
        image?: string
        siteName?: string
    }
    likedByCurrentUser?: boolean
}

const postSchema = new Schema<IPost>(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        image: { type: Schema.Types.ObjectId, ref: 'Image', required: false },
        linkUrl: { type: String },
        linkPreview: {
            title: String,
            description: String,
            image: String,
            siteName: String,
        },
    },
    { timestamps: true }
)

export default model<IPost>('Post', postSchema)
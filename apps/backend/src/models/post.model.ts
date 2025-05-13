// apps/backend/src/models/post.model.ts

import { Schema, model, Types } from 'mongoose'

const postSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User', required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
)

export default model('Post', postSchema)
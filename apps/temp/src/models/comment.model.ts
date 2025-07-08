// apps/backend/src/models/comment.model.ts

import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
	refId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	refType: {
		type: String,
		enum: ['Post', 'Image'],
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
}, { timestamps: true })

commentSchema.index({ refId: 1, refType: 1 })

export const Comment = mongoose.model('Comment', commentSchema)

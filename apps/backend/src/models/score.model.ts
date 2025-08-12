// apps/backend/src/models/score.model.ts

import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
	game: {
		type: String,
		enum: ['Tiles'],
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	score: {
		type: String,
		required: true,
	},
}, { timestamps: true })

export const Score = mongoose.model('Score', scoreSchema)

// apps/backend/src/services/score.service.ts

import mongoose from 'mongoose'
import { HttpError } from '../utils/HttpError'
import { Score } from '../models/score.model'

export const createScore = async (
	user: string,
	score: string
) => {
    
	const toObjectId = (id: string | mongoose.Types.ObjectId) =>
		typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id

	const newScore = await Score.create({
		game: 'Tiles',
		user: toObjectId(user),
		score,
	})

	return Score.findById(newScore._id).populate('user', 'username avatar')
}

export const getScoresForGame = async () => {

	const scores = await Score.find({})
        .sort({ score: 1 })
        .limit(3)
		.populate({
			path: 'user',
			select: 'username avatar',
			populate: { path: 'avatar', select: '_id filename variants username' },
		})
    
	if (!scores) {
		throw new HttpError(`Scores for Tiles not found`, 404)
	}

	return scores
}

export const clearScoresForGame = async () => {

	const deleted = await Score.deleteMany({})

	if (!deleted) {
		throw new HttpError(`Scores for Tiles could not be deleted`, 404)
	}

	return deleted
}
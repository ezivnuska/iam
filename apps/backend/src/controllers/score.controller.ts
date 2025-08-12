// apps/backend/src/controllers/score.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as scoreService from '../services/score.service'

export const addScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    console.log(req.user!.id)
	const { score } = req.body
	if (!score) {
		res.status(400).json({ message: 'Missing game or score' })
		return
	}

	try {
		const newScore = await scoreService.createScore(req.user!.id, score)
		res.status(201).json(newScore)
	} catch (err) {
		next(err)
	}
}

export const getScores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const scores = await scoreService.getScoresForGame()
		res.json(scores)
	} catch (err) {
		next(err)
	}
}

export const clearScores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

	try {
		const data = await scoreService.clearScoresForGame()
		res.json(data)
	} catch (err) {
		next(err)
	}
}

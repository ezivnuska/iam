// packages/services/src/api/scores.ts

import { api } from './'

export const fetchScoresForGame = async () => {
	const res = await api.get('/scores')
	return res.data
}

export const addNewScore = async (score: string) => {
	const res = await api.post('/scores', { score })
	return res.data
}

export const clearAllScores = async () => {
	const res = await api.delete(`/scores`)
	return res.data
}

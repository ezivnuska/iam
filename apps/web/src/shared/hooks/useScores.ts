// apps/web/src/hooks/useScores.ts

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as scoreService from '@iam/services'
import type { Score } from '@iam/types'

export const useScores = () => {
	const [scores, setScores] = useState<Score[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchScores = async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await scoreService.fetchScoresForGame()
            console.log('data fetched', data)
			setScores(data)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}

	// const createScore = async (score: string) => {
	// 	try {
	// 		const newScore = await scoreService.addNewScore(score)
    //         console.log('SERVICE: createScore', newScore)
    //         setScores([...scores, newScore])
	// 	} catch (err) {
	// 		throw err
	// 	}
	// }

    useEffect(() => {
        console.log('SCORES CHANGED', scores)
    }, [scores])

    const addScore = (score: Score) => {
        console.log('adding new score from hook', score)
        console.log('previous scores', scores)
        const newScores = [...scores, score]
        console.log('newScores', newScores)
        setScores(newScores)
    }

    const clearScores = async () => {
        try {
			const { acknowledged } = await scoreService.clearAllScores()
            if (acknowledged) setScores([])
		} catch (err) {
			throw err
		}
    }

    const getFilteredScores =() => {
        const filteredScores = scores.slice().sort((a, b) => {
            const first = Number(a.score.split(':').join('').toString())
            const second = Number(b.score.split(':').join('').toString())
            return first - second
        })
        console.log('filteredScores', filteredScores)
        return filteredScores
    }

	return {
		scores,
		loading,
		error,
        addScore,
        clearScores,
		// createScore,
		fetchScores,
		setScores,
	}
}

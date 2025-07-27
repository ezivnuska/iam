// apps/web/src/hooks/useBonds.ts

import { useCallback, useEffect, useState } from 'react'
import * as bondService from '@iam/services'
import type { Bond } from '@iam/types'

export const useBonds = (userId: string) => {
	const [bonds, setBonds] = useState<Bond[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchBonds = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await bondService.getUserBonds(userId)
			setBonds(data)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [userId])

	useEffect(() => {
		if (!userId) {
			setBonds(null)
			return
		}
		fetchBonds()
	}, [userId, fetchBonds])

	const createBond = async (responderId: string) => {
		try {
			const bond = await bondService.createBond(responderId)
			await fetchBonds()
			return bond
		} catch (err) {
			throw err
		}
	}

	const updateBond = async (
		bondId: string,
		statusUpdate: Partial<{ confirmed: boolean }>
	) => {
		try {
			await bondService.updateBondStatus(bondId, statusUpdate, userId)
			await fetchBonds()
		} catch (err) {
			throw err
		}
	}

	const removeBond = async (bondId: string) => {
		try {
			await bondService.deleteBond(bondId)
			await fetchBonds()
		} catch (err) {
			throw err
		}
	}

	return {
		bonds,
		loading,
		error,
		createBond,
		updateBond,
		removeBond,
		refetch: fetchBonds,
		setBonds,
	}
}

// apps/web/src/hooks/useBonds.ts

import { useState, useEffect, useCallback } from 'react'
import * as bondService from '@services'
import { Bond } from '@iam/types'

export const useBonds = (userId: string) => {
	const [bonds, setBonds] = useState<Bond[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const [actionLoading, setActionLoading] = useState(false)
	const [actionError, setActionError] = useState<Error | null>(null)

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
		setActionLoading(true)
		setActionError(null)
		try {
			const newBond = await bondService.createBond(responderId)
			await fetchBonds()
			return newBond
		} catch (err) {
			setActionError(err as Error)
			throw err
		} finally {
			setActionLoading(false)
		}
	}	

	const updateBond = async (bondId: string, statusUpdate: Partial<{ confirmed: boolean }>) => {
		setActionLoading(true)
		setActionError(null)
		try {
			await bondService.updateBondStatus(bondId, statusUpdate, userId)
			await fetchBonds()
		} catch (err) {
			setActionError(err as Error)
		} finally {
			setActionLoading(false)
		}
	}
	
	const removeBond = async (bondId: string) => {
		setActionLoading(true)
		setActionError(null)
		try {
			await bondService.deleteBond(bondId)
			await fetchBonds()
		} catch (err) {
			setActionError(err as Error)
		} finally {
			setActionLoading(false)
		}
	}
	
	
	return {
		bonds,
		loading,
		error,
		actionLoading,
		actionError,
		createBond,
		refetch: fetchBonds,
		removeBond,
		updateBond,
	}
}

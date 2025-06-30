// apps/web/src/hooks/useUserBondActions.ts

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth, useBonds, useBondSocket, useSocket } from '@/hooks'
import { Alert } from 'react-native'
import type { User, Bond } from '@iam/types'

export type FilterType = 'all' | 'bonded' | 'pending'

export const useUserBondActions = (users: User[]) => {
	const [filter, setFilter] = useState<FilterType>('all')
	const { user: currentUser } = useAuth()
	const [liveBonds, setLiveBonds] = useState<Bond[]>([])

	const {
		bonds,
		error: bondsError,
		loading: loadingBonds,
		refetch: refetchBonds,
		createBond,
		removeBond,
		updateBond,
	} = useBonds(currentUser?.id ?? '')

	const { emitBondCreate, emitBondUpdate, emitBondDelete } = useSocket()

	useEffect(() => {
		setLiveBonds(bonds ?? [])
	}, [bonds])

	useBondSocket(currentUser?.id ?? '', {
		onCreated: (bond) => setLiveBonds((prev) => [...prev, bond]),
		onUpdated: (updated) =>
			setLiveBonds((prev) =>
				prev.map((b) => (b._id === updated._id ? updated : b))
			),
		onDeleted: (bondId) =>
			setLiveBonds((prev) => prev.filter((b) => b._id !== bondId)),
		onError: (msg) => {
			console.error('Bond socket error:', msg)
		},
	})

	const getBondForUser = useCallback(
		(userId: string): Bond | undefined => {
			return liveBonds.find(
				(bond) =>
					(bond.sender === userId && bond.responder === currentUser?.id) ||
					(bond.responder === userId && bond.sender === currentUser?.id)
			)
		},
		[liveBonds, currentUser?.id]
	)

	const filteredUsers = useMemo(() => {
		return users.filter((user) => {
			const bond = getBondForUser(user.id)
			switch (filter) {
				case 'bonded':
					return bond?.confirmed
				case 'pending':
					return bond && !bond.confirmed
				default:
					return true
			}
		})
	}, [users, getBondForUser, filter])

	const requestBond = async (responderId: string) => {
		try {
			await createBond(responderId)
			emitBondCreate(responderId)
		} catch {
			Alert.alert('Error', 'Could not create bond')
		}
	}
	
	const confirmBond = async (userId: string) => {
		const bond = getBondForUser(userId)
		if (bond) {
			try {
				await updateBond(bond._id, { confirmed: true })
				emitBondUpdate(bond._id, { confirmed: true })
			} catch {
				Alert.alert('Error', 'Could not confirm bond')
			}
		}
	}
	
	const deleteBondByUser = async (userId: string) => {
		const bond = getBondForUser(userId)
		if (bond) {
			try {
				await removeBond(bond._id)
				emitBondDelete(bond._id)
			} catch {
				Alert.alert('Error', 'Could not delete bond')
			}
		}
	}

	return {
		filter,
		setFilter,
		filteredUsers,
		getBondForUser,
		requestBond,
		confirmBond,
		deleteBondByUser,
		bondsError,
		loadingBonds,
	}
}

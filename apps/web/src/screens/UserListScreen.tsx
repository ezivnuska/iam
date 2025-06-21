// packages/screens/src/screens/UserListScreen.tsx

import React, { useCallback, useEffect, useState } from 'react'
import { Alert, ActivityIndicator, Text } from 'react-native'
import { PageLayout, UserList } from '@/components'
import { useAuth, useBonds, usePresence, useSocket } from '@/hooks'
import { usePaginatedFetch } from '@services'
import type { Bond, User } from '@iam/types'
import { normalizeUser } from '@utils'
import type { FilterType } from '@/components'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type NavProps = StackNavigationProp<RootStackParamList, 'UserList'>

export const UserListScreen = () => {
	const [filter, setFilter] = useState<FilterType>('all')
	const { user: currentUser } = useAuth()
	const {
        bonds,
        error: bondsError,
        loading: loadingBonds,
        refetch: refetchBonds,
        createBond,
        removeBond,
        setBonds,
        updateBond,
    } = useBonds(currentUser?.id ?? '')
	const { isOnline } = usePresence()
	const { socket } = useSocket()
	const navigation = useNavigation<NavProps>()
	const { data, fetchNextPage, loading } = usePaginatedFetch<User>('users')

	const otherUsers = (data ?? []).filter(u => u.email !== currentUser?.email)

	const getBondForUser = useCallback(
		(userId: string) => {
			return bonds?.find(
				(bond) =>
					(bond.sender === userId && bond.responder === currentUser?.id) ||
					(bond.responder === userId && bond.sender === currentUser?.id)
			)
		},
		[bonds, currentUser?.id]
	)

	const filteredUsers = otherUsers.filter((user) => {
		const bond = getBondForUser(user.id)
		switch (filter) {
			case 'bonded':
				return bond?.confirmed
			case 'pending':
				return bond && !bond.confirmed
			case 'all':
			default:
				return true
		}
	})

	useEffect(() => {
		if (!socket) return

		const onBondCreated = (newBond: Bond) => {
			setBonds((prev) => (prev?.some(b => b._id === newBond._id) ? prev : [...(prev ?? []), newBond]))
		}

		const onBondUpdated = (updatedBond: Bond) => {
			setBonds((prev) => prev?.map(b => (b._id === updatedBond._id ? updatedBond : b)) ?? [updatedBond])
		}

		const onBondDeleted = (bond: Bond) => {
			setBonds((prev) => prev?.filter(b => b._id !== bond._id) ?? [])
		}

		socket.on('bond:created', onBondCreated)
		socket.on('bond:updated', onBondUpdated)
		socket.on('bond:deleted', onBondDeleted)

		return () => {
			socket.off('bond:created', onBondCreated)
			socket.off('bond:updated', onBondUpdated)
			socket.off('bond:deleted', onBondDeleted)
		}
	}, [socket])

	const updateBondStatus = async (bondId: string, statusUpdate: Partial<{ confirmed: boolean; declined: boolean; cancelled: boolean }>) => {
		try {
			await updateBond(bondId, statusUpdate)
			refetchBonds()
		} catch {
			Alert.alert('Error', 'Could not update bond status')
		}
	}

	const requestBond = async (responderId: string) => {
		try {
			await createBond(responderId)
			refetchBonds()
		} catch {
			Alert.alert('Error', 'Could not create bond')
		}
	}

	const deleteBond = async (bondId: string) => {
		try {
			await removeBond(bondId)
			refetchBonds()
		} catch {
			Alert.alert('Error', 'Could not delete bond')
		}
	}

	const handleUserPress = (user: User) => {
		navigation.navigate('Details', { id: user.id })
	}

	if (loadingBonds) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />
	if (bondsError) return <Text>Error loading bonds</Text>

	return (
		<PageLayout>
			<UserList
				users={filteredUsers.map(normalizeUser)}
				filter={filter}
				onFilterChange={setFilter}
				getBond={getBondForUser}
				isOnline={isOnline}
				onConfirm={(id) => {
					const bond = getBondForUser(id)
					if (bond) updateBondStatus(bond._id, { confirmed: true })
				}}
				onCreate={requestBond}
				onDelete={(id) => {
					const bond = getBondForUser(id)
					if (bond) deleteBond(bond._id)
				}}
				onUserPress={handleUserPress}
				onEndReached={fetchNextPage}
				loading={loading}
			/>
		</PageLayout>
	)
}

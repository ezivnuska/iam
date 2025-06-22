// packages/screens/src/screens/UserListScreen.tsx

import React, { useCallback, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Column, PageLayout, Spinner, UserList } from '@/components'
import { useAuth, useBonds, usePresence, useSocket } from '@/hooks'
import { usePaginatedFetch } from '@services'
import type { Bond, User } from '@iam/types'
import { normalizeUser } from '@utils'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type NavProps = StackNavigationProp<RootStackParamList, 'UserList'>

export type FilterType = 'all' | 'bonded' | 'pending'

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
        navigation.navigate('Details', { username: user.username })
    }
    
    const renderFilterButton = (label: string, value: FilterType) => (
        <TouchableOpacity onPress={() => setFilter(value)} style={[styles.filterButton, filter === value && styles.activeFilter]}>
            <Text style={filter === value ? styles.activeFilterText : styles.filterText}>{label}</Text>
        </TouchableOpacity>
    )

    const onConfirmBond = (bondId: string) => {
        const bond = getBondForUser(bondId)
        if (bond) updateBondStatus(bond._id, { confirmed: true })
    }

    const onDeleteBond = (bondId: string) => {
        const bond = getBondForUser(bondId)
        if (bond) deleteBond(bond._id)
    }

	return (
        <PageLayout>
            {bondsError && <Text>Error loading bonds</Text>}
            {(loading || loadingBonds)
                ? <Spinner />
                : (
                    <Column>
                        <View style={styles.filterContainer}>
                            {renderFilterButton('All', 'all')}
                            {renderFilterButton('Connections', 'bonded')}
                            {renderFilterButton('Pending', 'pending')}
                        </View>
                        <UserList
                            users={filteredUsers.map(normalizeUser)}
                            getBond={getBondForUser}
                            isOnline={isOnline}
                            onConfirm={onConfirmBond}
                            onCreate={requestBond}
                            onDelete={onDeleteBond}
                            onUserPress={handleUserPress}
                            onEndReached={fetchNextPage}
                            loading={loading}
                        />
                    </Column>
                )
            }
			
		</PageLayout>
	)
}

const styles = StyleSheet.create({
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	filterButton: {
		padding: 10,
		borderRadius: 5,
	},
	activeFilter: {
		// backgroundColor: '#007AFF',
	},
	filterText: {
		color: '#eee',
	},
	activeFilterText: {
		color: '#fff',
		fontWeight: 'bold',
	},
})

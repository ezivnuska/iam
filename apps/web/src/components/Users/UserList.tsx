// packages/screens/src/screens/UserList.tsx

import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { UserListItem } from '@/components'
import { usePaginatedFetch } from '@services'
import { useAuth, useBonds, usePresence, useSocket } from '@/hooks'
import type { Bond, RootStackParamList, User } from '@iam/types'
import { Size } from '@/styles'
import { normalizeUser } from '@utils'

type NavProps = StackNavigationProp<RootStackParamList, 'UserList'>

type FilterType = 'all' | 'bonded' | 'pending'

export const UserList = () => {
    const [filter, setFilter] = useState<FilterType>('all')
    const { user: currentUser } = useAuth()
    const { bonds, createBond, removeBond, setBonds, updateBond, loading: loadingBonds, error: bondsError, refetch: refetchBonds } = useBonds(currentUser?.id ?? '')
    const { isOnline } = usePresence()
	const { socket } = useSocket()
	const navigation = useNavigation<NavProps>()
	const { data, fetchNextPage, loading } = usePaginatedFetch<User>('users')

    const otherUsers = (data ?? []).filter((u) => u.email !== currentUser?.email)

	useEffect(() => {
		if (!socket) return

		const onBondCreated = (newBond: Bond) => {
			setBonds((prev) => {
				if (!prev) return [newBond]
				const exists = prev.some((b) => b._id === newBond._id)
				return exists ? prev : [...prev, newBond]
			})
		}
	
		const onBondUpdated = (updatedBond: Bond) => {
			setBonds((prev) => {
				if (!prev) return [updatedBond]
				return prev.map((b) => (b._id === updatedBond._id ? updatedBond : b))
			})
		}
	
		const onBondDeleted = (bond: Bond) => {
			setBonds((prev) => {
				if (!prev) return []
				return prev.filter((b) => b._id !== bond._id)
			})
		}
	  
		socket.on('bond:created', onBondCreated)
		socket.on('bond:updated', onBondUpdated)
		socket.on('bond:deleted', onBondDeleted)
	  
		return () => {
			socket.off('bond:created', onBondCreated)
			socket.off('bond:updated', onBondUpdated)
			socket.off('bond:deleted', onBondDeleted)
		}
	}, [socket, refetchBonds])

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

    const updateBondStatus = async (bondId: string, statusUpdate: Partial<{ confirmed: boolean; declined: boolean; cancelled: boolean }>) => {
        try {
            await updateBond(bondId, statusUpdate)
            refetchBonds()
        } catch (err) {
            Alert.alert('Error', 'Could not update bond status')
        }
    }

    const requestBond = async (responderId: string) => {
        try {
            await createBond(responderId)
            refetchBonds()
        } catch (err) {
            Alert.alert('Error', 'Could not create bond')
        }
    }

    const deleteBond = async (bondId: string) => {
        try {
            await removeBond(bondId)
            refetchBonds()
        } catch (err) {
            Alert.alert('Error', 'Could not delete bond')
        }
    }

    const renderFilterButton = (label: string, value: FilterType) => (
        <TouchableOpacity onPress={() => setFilter(value)} style={[styles.filterButton, filter === value && styles.activeFilter]}>
            <Text style={filter === value ? styles.activeFilterText : styles.filterText}>{label}</Text>
        </TouchableOpacity>
    )

	const renderItem = useCallback((item: User) => {
		const userId = item.id ?? ''
		const bond = getBondForUser(userId)
	  
		return (
			<UserListItem
				bond={bond}
                isOnline={isOnline(userId)}
				onConfirm={() => bond && updateBondStatus(bond._id, { confirmed: true })}
				onCreate={() => requestBond(userId)}
				onDelete={() => bond && deleteBond(bond._id)}
				onPress={() => navigation.navigate('Details', { id: userId })}
				profile={item}
			/>
		)
	}, [getBondForUser, isOnline, updateBondStatus, requestBond, deleteBond, navigation])

	if (loadingBonds) {
		return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />
	}
	  
	if (bondsError) {
		return <Text>Error loading bonds</Text>
	}

    return bonds && (
        <View style={{ flex: 1 }}>
            <View style={styles.filterContainer}>
                {renderFilterButton('All', 'all')}
                {renderFilterButton('Bonded', 'bonded')}
                {renderFilterButton('Pending', 'pending')}
            </View>
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id || item.email}
                scrollEnabled={false}
                renderItem={({ item }) => renderItem(normalizeUser(item))}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
                contentContainerStyle={{ paddingVertical: Size.S }}
            />
        </View>
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
        backgroundColor: '#007AFF',
    },
    filterText: {
        color: '#333',
    },
    activeFilterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})

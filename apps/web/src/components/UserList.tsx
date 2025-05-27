// packages/screens/src/screens/UserListScreen.tsx

import React, { useCallback } from 'react'
import { ActivityIndicator, Alert, FlatList, StyleSheet } from 'react-native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { UserListItem } from '@/components'
import { usePaginatedFetch } from '@services'
import { useAuth, useBonds } from '@/hooks'
import type { RootStackParamList } from '@iam/types'
import { Size } from '@/styles'

type NavProps = StackNavigationProp<RootStackParamList, 'UserList'>

export const UserList = () => {
	const navigation = useNavigation<NavProps>()
    const { user: currentUser } = useAuth()

    const { data, fetchNextPage, loading } = usePaginatedFetch<any>('users')

    const { bonds, createBond, removeBond, updateBond, loading: loadingBonds, error: bondsError, refetch: refetchBonds } = useBonds(currentUser?.id ?? '')

    const getBondForUser = useCallback(
        (userId: string) => {
            return bonds?.find(
                (bond) =>
                (bond.sender === userId && bond.responder === currentUser?.id) ||
                bond.responder === userId && bond.sender === currentUser?.id)
        },
        [bonds]
    )

    const otherUsers = (data ?? []).filter((u) => u.email !== currentUser?.email)
    
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

	return bonds && (
        <FlatList
            data={otherUsers}
            keyExtractor={(item) => item._id || item.email}
            scrollEnabled={false}
            renderItem={({ item }) => {
                const bond = getBondForUser(item._id)
                return (
                    <UserListItem
                        bond={bond}
                        onConfirm={() => bond && updateBondStatus(bond._id, { confirmed: true })}
                        onCreate={() => requestBond(item._id)}
                        onDelete={() => bond && deleteBond(bond._id)}
                        onPress={() => navigation.navigate('Details', { id: item._id })}
                        profile={item}
                    />
                )
            }}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
            contentContainerStyle={{ paddingVertical: Size.S }}
        />
	)
}
// packages/screens/src/components/UserList.tsx

import React, { useCallback } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Size } from '@/styles'
import type { User, Bond } from '@iam/types'
import { UserListItem } from '@/components'

export type FilterType = 'all' | 'bonded' | 'pending'

type Props = {
	users: User[]
	filter: FilterType
	onFilterChange: (filter: FilterType) => void
	getBond: (userId: string) => Bond | undefined
	isOnline: (userId: string) => boolean
	onConfirm: (userId: string) => void
	onCreate: (userId: string) => void
	onDelete: (userId: string) => void
	onUserPress: (user: User) => void
	onEndReached: () => void
	loading: boolean
}

export const UserList = ({
	users,
	filter,
	onFilterChange,
	getBond,
	isOnline,
	onConfirm,
	onCreate,
	onDelete,
	onUserPress,
	onEndReached,
	loading,
}: Props) => {
	const renderFilterButton = (label: string, value: FilterType) => (
		<TouchableOpacity onPress={() => onFilterChange(value)} style={[styles.filterButton, filter === value && styles.activeFilter]}>
			<Text style={filter === value ? styles.activeFilterText : styles.filterText}>{label}</Text>
		</TouchableOpacity>
	)

	const renderItem = useCallback((item: User) => {
	  
		return (
			<UserListItem
				profile={item}
				bond={getBond(item.id)}
				isOnline={isOnline(item.id)}
				onConfirm={() => onConfirm(item.id)}
				onCreate={() => onCreate(item.id)}
				onDelete={() => onDelete(item.id)}
				onPress={() => onUserPress(item)}
			/>
		)
	}, [getBond, isOnline, onConfirm, onCreate, onDelete])

	return (
		<View style={styles.container}>
			<View style={styles.filterContainer}>
				{renderFilterButton('All', 'all')}
				{renderFilterButton('Connections', 'bonded')}
				{renderFilterButton('Pending', 'pending')}
			</View>
			<FlatList
				data={users}
				keyExtractor={(item) => item.id || item.email}
				scrollEnabled={false}
				renderItem={({ item }) => renderItem(item)}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.5}
				ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
                style={{ flex: 1 }}
				contentContainerStyle={{ paddingVertical: Size.S }}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
	},
    loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
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

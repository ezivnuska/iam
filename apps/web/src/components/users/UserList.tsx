// packages/screens/src/components/UserList.tsx

import React, { useCallback } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { Size } from '@iam/theme'
import type { User, Bond } from '@iam/types'
import { UserListItem } from '@/components'

type Props = {
	users: User[]
	loading: boolean
	getBond: (userId: string) => Bond | undefined
	isOnline: (userId: string) => boolean
	onConfirm: (userId: string) => void
	onCreate: (userId: string) => void
	onDelete: (userId: string) => void
	onUserPress: (user: User) => void
	onEndReached: () => void
}

export const UserList = ({
	users,
	loading,
	getBond,
	isOnline,
	onConfirm,
	onCreate,
	onDelete,
	onUserPress,
	onEndReached,
}: Props) => {
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
})

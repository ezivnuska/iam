// apps/web/src/components/BondList.tsx

import React from 'react'
import { View, Text, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useBonds } from '@/hooks'

const BondList = ({ userId }: { userId: string }) => {
	const { bonds, loading, error, refetch } = useBonds(userId)

	if (loading) return <ActivityIndicator size='large' style={styles.center} />

	if (error)
		return (
			<View style={styles.center}>
				<Text style={styles.error}>Error: {error.message}</Text>
				<Button title='Try again' onPress={refetch} />
			</View>
		)

	if (!bonds || bonds.length === 0)
		return (
			<View style={styles.center}>
				<Text>No bonds found.</Text>
				<Button title='Refresh' onPress={refetch} />
			</View>
		)

	return (
		<View style={styles.container}>
			<FlatList
				data={bonds}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
				<View style={styles.bondItem}>
					<Text>
					Bond between {item.sender} and {item.responder}
					</Text>
				</View>
				)}
				refreshing={loading}
				onRefresh={refetch}
			/>
			<Button title='Refresh Bonds' onPress={refetch} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	bondItem: {
		padding: 12,
		marginVertical: 6,
		backgroundColor: '#eee',
		borderRadius: 6,
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	error: {
		color: 'red',
		marginBottom: 12,
	},
})

export default BondList

// apps/web/src/components/users/UserListNav.tsx

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { FilterType } from '@/hooks'

interface UserListNavProps {
	filter: FilterType
	setFilter: (value: FilterType) => void
}

const filterOptions: { label: string; value: FilterType }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Connections', value: 'bonded' },
	{ label: 'Pending', value: 'pending' },
]

export const UserListNav: React.FC<UserListNavProps> = ({ filter, setFilter }) => {
	return (
		<View style={styles.container}>
			{filterOptions.map(({ label, value }) => (
				<TouchableOpacity
					key={value}
					onPress={() => setFilter(value)}
					style={[styles.button, filter === value && styles.activeButton]}
				>
					<Text style={filter === value ? styles.activeText : styles.text}>{label}</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 10,
	},
	button: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#444',
	},
	activeButton: {
		backgroundColor: '#666',
	},
	text: {
		color: '#ccc',
	},
	activeText: {
		color: '#fff',
		fontWeight: 'bold',
	},
})

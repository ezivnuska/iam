// apps/web/src/components/users/UserListNav.tsx

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { FilterType } from '@shared/hooks'
import { Button } from '@shared/buttons'

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
				<Button
					key={value}
                    label={label}
					onPress={() => setFilter(value)}
                    variant='transparent'
					// style={filter === value && styles.activeButton}
				/>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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

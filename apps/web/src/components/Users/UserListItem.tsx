// apps/web/src/components/UserListItem.tsx

import React from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { Avatar, BondControls, Column, Row } from '@/components'
import { useAuth } from '@/hooks'
import { User, Bond } from '@iam/types'
import { Size } from '@/styles'

type UserListItemProps = {
	profile: User
	onPress?: () => void
	showEmail?: boolean
	bond?: Bond | null
	onConfirm?: () => void
	onDelete?: () => void
	onCreate?: () => void
}

export const UserListItem = ({
	profile,
	onPress,
	showEmail = true,
	bond,
	onConfirm,
	onDelete,
	onCreate,
}: UserListItemProps) => {
	const { user } = useAuth()

	return (
		<Row flex={1} spacing={Size.M} justify='space-between' style={styles.container}>
			<Pressable onPress={onPress}>
				<Row flex={1} spacing={Size.M}>
					<Avatar user={profile} size='md' />
					<Column flex={1}>
						<Text style={styles.username}>{profile.username}</Text>
						{showEmail && <Text style={styles.email}>{profile.email}</Text>}
					</Column>
				</Row>
			</Pressable>

			<BondControls
				bond={bond}
				userId={user?.id}
				onConfirm={onConfirm}
				onDelete={onDelete}
				onCreate={onCreate}
			/>
		</Row>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: Size.XS,
        paddingHorizontal: Size.M,
	},
	info: {
		flex: 1,
	},
	username: {
		fontSize: 18,
		fontWeight: '600',
	},
	email: {
		color: '#666',
		fontSize: 14,
	},
})

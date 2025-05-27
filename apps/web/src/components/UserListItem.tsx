// apps/web/src/components/UserListItem.tsx

import React from 'react'
import { StyleSheet, Text, Image, Pressable } from 'react-native'
import { Column, IconButton, ProfileImage, Row } from '@/components'
import { useAuth } from '@/hooks'
import { User, Bond } from '@iam/types'
import { Size } from '@/styles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
					{profile.avatar ? (
						<ProfileImage user={profile} size='md' />
					) : (
						<Image
							source={{ uri: getPlaceholder(profile.username) }}
							style={styles.avatar}
						/>
					)}
					<Column flex={1}>
						<Text style={styles.username}>{profile.username}</Text>
						{showEmail && <Text style={styles.email}>{profile.email}</Text>}
					</Column>
				</Row>
			</Pressable>
			{bond && onConfirm && onDelete && bond.responder === user?.id && !bond.confirmed && (
				<Row style={{ borderWidth: 1, }}>
					<IconButton
						onPress={onConfirm}
						icon={<MaterialIcons name='check-circle' size={30} color='green' />}
					/>
					<IconButton
						onPress={onDelete}
						icon={<MaterialIcons name='cancel' size={30} color='red' />}
					/>
				</Row>
			)}
			{bond && onDelete && (
				<IconButton
					icon={<MaterialIcons name={bond.confirmed ? 'person-remove' : 'cancel'} size={30} color={bond.confirmed ? 'red' : 'gray'} />}
					onPress={onDelete}
				/>
			)}
			{!bond && onCreate && (
				<IconButton
					icon={<MaterialIcons name='person-add' size={30} color='blue' />}
					onPress={onCreate}
				/>
			)}
		</Row>
	)
}

const getPlaceholder = (name: string) =>
	`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`

const styles = StyleSheet.create({
	container: {
		paddingVertical: Size.XS,
        paddingHorizontal: Size.M,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#ddd',
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

import React from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { User } from '@iam/types'
import { AutoSizeImage, Row } from '@/components'

type UserProfileCardProps = {
	user: User
	onPress?: () => void
	showEmail?: boolean
}

const AVATAR_SIZE = 50

export const UserProfileCard = ({
	user,
	onPress,
	showEmail = true,
}: UserProfileCardProps) => {
	const Container = onPress ? Pressable : View

	return (
		<Container style={styles.container} onPress={onPress}>
			{user.avatar ? (
				<View style={styles.avatarContainer}>
					<AutoSizeImage image={user.avatar} forceSquare />
				</View>
			) : (
				<Image
					source={{ uri: getPlaceholder(user.username) }}
					style={styles.avatar}
				/>
			)}
			<View style={styles.info}>
				<Text style={styles.username}>{user.username}</Text>
				{showEmail && <Text style={styles.email}>{user.email}</Text>}
			</View>
		</Container>
	)
}

const getPlaceholder = (name: string) =>
	`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`

const styles = StyleSheet.create({
	container: {
        flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 12,
		backgroundColor: '#f9f9f9',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		marginBottom: 8,
		gap: 16,
	},
	avatarContainer: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		overflow: 'hidden',
		backgroundColor: '#ddd',
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		overflow: 'hidden',
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
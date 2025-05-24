import React from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { User } from '@iam/types'

type UserProfileCardProps = {
	user: User
	onPress?: () => void
	showEmail?: boolean
	avatarSize?: number
}

export const UserProfileCard = ({
	user,
	onPress,
	showEmail = true,
	avatarSize = 64,
}: UserProfileCardProps) => {
	const Container = onPress ? Pressable : View

    const uri = user.avatar?.url ?? getPlaceholder(user.username)

	return (
		<Container style={styles.container} onPress={onPress}>
			<Image
				source={{ uri }}
				style={[
					styles.avatar,
					{
						width: avatarSize,
						height: avatarSize,
						borderRadius: avatarSize / 2,
					},
				]}
			/>
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
	},
	avatar: {
		marginRight: 12,
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
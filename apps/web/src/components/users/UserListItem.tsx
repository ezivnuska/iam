// apps/web/src/components/UserListItem.tsx

import React from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { Avatar, BondControls, Column, Row } from '@/components'
import { useAuth, useTheme } from '@/hooks'
import { User, Bond } from '@iam/types'
import { paddingHorizontal, Size } from '@iam/theme'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

type UserListItemProps = {
	profile: User
	onPress?: () => void
	showEmail?: boolean
	bond?: Bond | null
	isOnline: boolean,
	onConfirm?: () => void
	onDelete?: () => void
	onCreate?: () => void
}

export const UserListItem = ({
	profile,
	onPress,
	showEmail = true,
	bond,
	isOnline,
	onConfirm,
	onDelete,
	onCreate,
}: UserListItemProps) => {
	const { user } = useAuth()
    const { theme } = useTheme()
	return (
		<Row flex={1} spacing={Size.M} justify='space-between' align='center' style={styles.container}>
			<Pressable onPress={onPress}>
				<Row flex={1} spacing={Size.M}>
					<Avatar user={profile} size='md' />
					<Column flex={1}>
						<Row flex={1} spacing={Size.S} align='center'>
							<Text
                                style={[
                                    styles.username,
                                    { color: theme.colors.text },
                                ]}
                            >
                                {profile.username}
                            </Text>
							{isOnline && <MaterialIcons name='co-present' size={18} color='green' />}
						</Row>
						{showEmail && (
                            <Text
                                style={[
                                    styles.email,
                                    { color: theme.colors.textSecondary },
                                ]}
                            >
                                {profile.email}
                            </Text>
                        )}
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
        paddingHorizontal: paddingHorizontal,
	},
	info: {
		flex: 1,
	},
	username: {
		fontSize: 18,
		fontWeight: '600',
	},
	email: {
		fontSize: 14,
	},
})

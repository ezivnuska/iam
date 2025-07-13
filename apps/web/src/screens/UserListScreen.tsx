// packages/screens/src/screens/UserListScreen.tsx

import React from 'react'
import { Text } from 'react-native'
import { Column, UserListNav, PageLayout, Spinner, UserList, ScreenLayout } from '@/components'
import { useUserList } from '@/hooks'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { normalizeUser } from '@utils'

type NavProps = StackNavigationProp<RootStackParamList, 'UserList'>

export const UserListScreen = () => {
	const {
		filter,
		setFilter,
		filteredUsers,
		getBondForUser,
		requestBond,
		confirmBond,
		deleteBondByUser,
		isOnline,
		loadingUsers,
		loadingBonds,
		fetchNextPage,
		bondsError,
	} = useUserList()

	const navigation = useNavigation<NavProps>()

	const handleUserPress = (user: any) => {
		navigation.navigate('UserProfile', { username: user.username })
	}

	return (
		<ScreenLayout>
			{(loadingUsers || loadingBonds) ? (
                <Spinner label='Loading users...' />
            ) : (
                <Column>
                    <UserListNav filter={filter} setFilter={setFilter} />
                    <UserList
                        users={filteredUsers.map(normalizeUser)}
                        getBond={getBondForUser}
                        isOnline={isOnline}
                        onConfirm={confirmBond}
                        onCreate={requestBond}
                        onDelete={deleteBondByUser}
                        onUserPress={handleUserPress}
                        onEndReached={fetchNextPage}
                        loading={loadingUsers}
                    />
                </Column>
            )}
		</ScreenLayout>
	)
}

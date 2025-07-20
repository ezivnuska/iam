// packages/screens/src/screens/UserListScreen.tsx

import React from 'react'
import { Column, UserListNav, Spinner, UserList, Screen } from '@/components'
import { useUserList } from '@/hooks'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { User, UserStackParamList } from '@iam/types'
import { normalizeUser } from '@utils'

type NavProps = StackNavigationProp<UserStackParamList, 'UserList'>

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

	const { navigate } = useNavigation<NavProps>()

	const handleUserPress = (user: User) => {
        if (!user?.username) return
        navigate('User', { screen: 'UserProfile', username: user.username })
    }        

	return (
		<Screen>
			{loadingUsers || loadingBonds ? (
				<Spinner label="Loading users..." />
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
		</Screen>
	)
}

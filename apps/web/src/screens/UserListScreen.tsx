// packages/screens/src/screens/UserListScreen.tsx

import React from 'react'
import { Text } from 'react-native'
import { Column, UserListNav, PageLayout, Spinner, UserList } from '@/components'
import { useUserList } from '@/hooks'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { UserStackParamList } from '@iam/types'
import { paddingHorizontal, resolveResponsiveProp } from '@iam/theme'
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
    const paddingVertical = resolveResponsiveProp({ xs: 4, sm: 8, md: 16, lg: 24 })

	const handleUserPress = (user: any) => {
		// navigate('UserProfile' as never)
		navigate('UserProfile', { username: user.username })
	}

	return (loadingUsers || loadingBonds) ? (
        <Spinner label='Loading users...' />
    ) : (
        <Column style={{ paddingHorizontal, paddingVertical }}>
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
    )
}

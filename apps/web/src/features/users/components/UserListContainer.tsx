// apps/web/src/features/users/components/UserListContainer.tsx

import React from 'react'
import { UserList } from './'
import { useUserList } from '../hooks'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { User, UserStackParamList } from '@iam/types'
import{ LoadingPanel } from '@shared/ui'
// import { normalizeUser } from '@utils'

type NavProps = StackNavigationProp<UserStackParamList, 'UserList'>

export const UserListContainer = () => {
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
        navigate('User', { username: user.username })
    }

    if (loadingUsers) {
        return <LoadingPanel label='Loading users...' />
    }

	return (
        <UserList
            users={filteredUsers}
            // users={filteredUsers.map(normalizeUser)}
            getBond={getBondForUser}
            isOnline={isOnline}
            onConfirm={confirmBond}
            onCreate={requestBond}
            onDelete={deleteBondByUser}
            onUserPress={handleUserPress}
            onEndReached={fetchNextPage}
            loading={loadingUsers}
        />
	)
}

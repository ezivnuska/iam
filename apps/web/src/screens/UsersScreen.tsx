// packages/screens/src/screens/UsersScreen.tsx

import React from 'react'
import { ScreenContainer, UserListContainer, UsersScreenHeader } from '@/components'
import { useUserList } from '@/hooks'
import { LoadingScreen } from '@/screens'

export const UsersScreen = () => {
	const { loadingUsers } = useUserList()

    if (loadingUsers) {
        return <LoadingScreen label='Loading users...' />
    }

	return (
        <ScreenContainer
            header={UsersScreenHeader}
            screen={UserListContainer}
        />
	)
}

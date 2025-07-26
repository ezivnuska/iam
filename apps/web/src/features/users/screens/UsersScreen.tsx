// app/web/src/features/users/screens/UsersScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { UserListContainer, UsersScreenHeader } from '../'

export const UsersScreen = () => {

	return (
        <ScreenContainer
            header={UsersScreenHeader}
            screen={UserListContainer}
        />
	)
}

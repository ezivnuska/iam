// packages/screens/src/screens/HomeScreen.tsx

import React from 'react'
import { PageHeader, PageLayout } from '@ui'
import { useAuth } from '@providers'

export const HomeScreen = () => {
    const { user, isAuthenticated } = useAuth()

	return (
		<PageLayout>
			<PageHeader title={`Home${isAuthenticated ? `: ${user?.username}` : ''}`} />
		</PageLayout>
	)
}
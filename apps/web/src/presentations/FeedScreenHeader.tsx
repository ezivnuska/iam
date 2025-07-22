// apps/web/src/presentations/FeedScreenHeader.tsx

import React from 'react'
import { CreatePostButton, PageHeader, ScreenHeaderContainer } from '@/components'
import { useAuth } from '@/hooks'

export const FeedScreenHeader = () => {
	const { isAuthenticated } = useAuth()

	return (
		<ScreenHeaderContainer>
            <PageHeader title='Feed' />
            {isAuthenticated && <CreatePostButton />}
		</ScreenHeaderContainer>
	)
}

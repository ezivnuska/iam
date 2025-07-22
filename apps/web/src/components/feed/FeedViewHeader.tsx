// apps/web/src/components/feed/FeedViewHeader.tsx

import React from 'react'
import { CreatePostButton, PageHeader, ScreenHeaderContainer } from '@/components'
import { useAuth } from '@/hooks'

export const FeedViewHeader = () => {
	const { isAuthenticated } = useAuth()

	return (
		<ScreenHeaderContainer>
            <PageHeader title='Feed' />
            {isAuthenticated && <CreatePostButton />}
		</ScreenHeaderContainer>
	)
}

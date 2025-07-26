// apps/web/src/features/feed/components/FeedViewHeader.tsx

import React from 'react'
import { CreatePostButton } from '@shared/buttons'
import { PageHeader } from '@shared/ui'
import { ScreenHeaderContainer } from '@shared/layout'
import { useAuth } from '@shared/hooks'

export const FeedViewHeader = () => {
	const { isAuthenticated } = useAuth()

	return (
		<ScreenHeaderContainer>
            <PageHeader title='Feed' />
            {isAuthenticated && <CreatePostButton />}
		</ScreenHeaderContainer>
	)
}

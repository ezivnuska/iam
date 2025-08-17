// apps/web/src/features/feed/components/FeedViewHeader.tsx

import React from 'react'
import { CreatePostButton } from '@shared/buttons'
import { PageHeader } from '@shared/ui'
import { useAuth } from '@shared/hooks'
import { Row } from '@shared/grid'
import { Size } from '@iam/theme'

export const FeedViewHeader = () => {
	const { isAuthenticated } = useAuth()

	return (
		<Row
            align='center'
            justify='space-between'
            spacing={Size.M}
            style={{ width: '100%' }}
        >
            <PageHeader title='Feed' />
            {isAuthenticated && <CreatePostButton />}
		</Row>
	)
}

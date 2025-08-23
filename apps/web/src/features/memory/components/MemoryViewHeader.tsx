// apps/web/src/features/memory/components/MemoryViewHeader.tsx

import React from 'react'
import { CreateMemoryButton } from '@shared/buttons'
import { PageHeader } from '@shared/ui'
import { useAuth } from '@shared/hooks'
import { Row } from '@shared/grid'
import { Size } from '@iam/theme'

export const MemoryViewHeader = () => {
	const { isAuthenticated } = useAuth()

	return (
		<Row
            align='center'
            justify='space-between'
            spacing={Size.M}
            style={{ width: '100%' }}
        >
            <PageHeader title='Memories' />
            {isAuthenticated && <CreateMemoryButton />}
		</Row>
	)
}

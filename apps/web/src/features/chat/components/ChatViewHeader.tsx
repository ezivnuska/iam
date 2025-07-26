// apps/web/src/features/chat/components/ChatViewHeader.tsx

import React from 'react'
import { PageHeader } from '@shared/ui'
import { ScreenHeaderContainer } from '@shared/layout'

export const ChatViewHeader = () => {

	return (
        <ScreenHeaderContainer>
            <PageHeader title='Chat' />
        </ScreenHeaderContainer>
	)
}

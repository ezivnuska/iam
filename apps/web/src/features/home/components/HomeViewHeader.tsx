// apps/web/src/features/home/components/HomeViewHeader.tsx

import React from 'react'
import { PageHeader } from '@shared/ui'
import { ScreenHeaderContainer } from '@shared/layout'

export const HomeViewHeader = () => {
	return (
		<ScreenHeaderContainer>
            <PageHeader title='Home' />
		</ScreenHeaderContainer>
	)
}

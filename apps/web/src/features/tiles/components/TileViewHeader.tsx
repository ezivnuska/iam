// apps/web/src/features/tiles/components/TileViewHeader.tsx

import React from 'react'
import { PageHeader } from '@shared/ui'
import { ScreenHeaderContainer } from '@shared/layout'

export const TileViewHeader = () => {
	return (
		<ScreenHeaderContainer>
            <PageHeader title='Tiles' />
		</ScreenHeaderContainer>
	)
}

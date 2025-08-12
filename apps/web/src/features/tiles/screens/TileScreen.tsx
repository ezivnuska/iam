// apps/web/src/features/tiles/screens/TileScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { TileView, TileViewHeader } from '../components'
import { TileProvider } from '../TileProvider'

export const TileScreen = () => {
	return (
        <TileProvider>
            <ScreenContainer
                header={TileViewHeader}
                screen={TileView}
            />
        </TileProvider>
	)
}

// apps/web/src/features/tiles/screens/TileScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { TileView } from '../components'
import { TileProvider } from '../TileProvider'
import { TileGameHeader } from '../components/TileGameHeader'

export const TileScreen = () => {
	return (
        <TileProvider>
            <ScreenContainer
                header={TileGameHeader}
                screen={TileView}
            />
        </TileProvider>
	)
}

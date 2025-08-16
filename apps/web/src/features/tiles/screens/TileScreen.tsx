// apps/web/src/features/tiles/screens/TileScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { TileView } from '../components'
import { TileProvider } from '../TileProvider'
import { TileGameHeader } from '../components/TileGameHeader'
import { usePreventBack } from '@shared/hooks'

export const TileScreen = () => {
    usePreventBack(' Are you sure you want to leave page?', () => {
        console.log('yes, leave')
        return true
    })
	return (
        <TileProvider>
            <ScreenContainer
                header={TileGameHeader}
                screen={TileView}
            />
        </TileProvider>
	)
}

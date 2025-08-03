// apps/web/src/features/tiles/screens/TileScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { GameBoard, TileView, TileViewHeader } from '../components'

export const TileScreen = () => {
	return (
        <ScreenContainer
            header={TileViewHeader}
            screen={GameBoard}
        />
	)
}

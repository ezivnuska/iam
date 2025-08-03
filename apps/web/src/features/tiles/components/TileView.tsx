// apps/web/src/features/tiles/components/TileView.tsx

import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@shared/hooks'
import { PageHeader } from '@shared/ui'
import TileGame from './TileGame'
import { GameBoard } from '.'

export const TileView = () => {
	const { theme } = useTheme()

	return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

            <GameBoard level={4} />
                {/* <TileGame /> */}
        </View>
	)
}

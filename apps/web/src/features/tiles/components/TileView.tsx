// apps/web/src/features/tiles/components/TileView.tsx

import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@shared/hooks'
import { TileGame } from './TileGame'

export const TileView = () => {
	const { theme } = useTheme()

	return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TileGame level={4} />
        </View>
	)
}

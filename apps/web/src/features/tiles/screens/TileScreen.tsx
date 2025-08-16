// apps/web/src/features/tiles/screens/TileScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { TileView } from '../components'
import { TileProvider } from '../TileProvider'
import { TileGameHeader } from '../components/TileGameHeader'
import { View } from 'react-native'
import { useTheme } from '@shared/hooks'

export const TileScreen = () => {
    const { theme } = useTheme()
	return (
        <TileProvider>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <View style={{ flex: 1, width: '90%', marginHorizontal: 'auto' }}>
                    <ScreenContainer
                        header={TileGameHeader}
                        screen={TileView}
                    />
                </View>
            </View>
        </TileProvider>
	)
}

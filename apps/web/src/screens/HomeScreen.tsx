// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { Text } from 'react-native'
import { ScreenContainer } from '@/components'

export const HomeScreen = () => {
	return (
        <ScreenContainer
            header={() => <Text>Screen Header</Text>}
            screen={() => <Text>Screen Title</Text>}
        />
	)
}

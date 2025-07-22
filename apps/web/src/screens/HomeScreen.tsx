// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { HomeView, HomeViewHeader, ScreenContainer } from '@/components'

export const HomeScreen = () => {
	return (
        <ScreenContainer
            header={HomeViewHeader}
            screen={HomeView}
        />
	)
}

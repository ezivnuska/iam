// apps/web/src/features/home/screens/HomeScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { HomeView, HomeViewHeader } from '../components'

export const HomeScreen = () => {
	return (
        <ScreenContainer
            header={HomeViewHeader}
            screen={HomeView}
        />
	)
}

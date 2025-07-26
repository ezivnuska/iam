// apps/web/src/features/profile/screens/ProfileScreen.tsx

import React from 'react'
import { ProfileViewHeader } from '../components'
import { ScreenContainer } from '@shared/layout'
import { ProfileNavigator } from '../'
import { ImageProvider } from '@shared/providers'

export const ProfileScreen: React.FC<any> = () => {

	return (
        <ImageProvider>
            <ScreenContainer
                header={ProfileViewHeader}
                screen={ProfileNavigator}
            />
        </ImageProvider>
	)
}

// apps/web/src/screens/ProfileScreen.tsx

import React from 'react'
import { ProfileViewHeader, ScreenContainer } from '@/components'
import { ProfileNavigator } from '@/navigation'
import { ImageProvider } from '@/providers'

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

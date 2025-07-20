// apps/web/src/screens/UserProfileScreen.tsx

import React from 'react'
import { Column, ImageGalleryContainer, ImageGalleryHeader, Row, Screen } from '@/components'
import { useAuth } from '@/hooks'
import { ImageProvider } from '@/providers'
import { LoadingScreen } from './LoadingScreen'

export const ImagesScreen = () => {

	const { user, isAuthInitialized } = useAuth()

    if (!isAuthInitialized) {
        return <LoadingScreen label='Authenticating...' />
    }

	return (
        <ImageProvider>
            <Screen>
                <Column
                    flex={1}
                    spacing={15}
                >
                    {/* <ImageGalleryHeader owner={true} /> */}

                    <ImageGalleryContainer userId={user?.id} />
                </Column>
            </Screen>
        </ImageProvider>
    )
}

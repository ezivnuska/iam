// apps/web/src/components/profile/ProfileImagesView.tsx

import React from 'react'
import { ImageGalleryContainer } from '@/components'
import { useAuth } from '@/hooks'
import { LoadingScreen } from '@/screens'

export const ProfileImagesView = () => {

	const { user, isAuthInitialized } = useAuth()

    if (!isAuthInitialized) {
        return <LoadingScreen label='Authenticating...' />
    }

	return (
        <ImageGalleryContainer userId={user?.id} />
    )
}

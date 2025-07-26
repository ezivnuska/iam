// apps/web/src/features/profile/components/ProfileImagesView.tsx

import React from 'react'
import { ImageGalleryContainer } from '@shared/images'
import { useAuth } from '@shared/hooks'
import { LoadingPanel } from '@shared/ui'

export const ProfileImagesView = () => {

	const { user, isAuthInitialized } = useAuth()

    if (!isAuthInitialized) {
        return <LoadingPanel label='Authenticating...' />
    }

	return (
        <ImageGalleryContainer userId={user?.id} />
    )
}

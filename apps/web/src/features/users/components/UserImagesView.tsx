// apps/web/src/features/users/components/UserImagesView.tsx

import React, { useMemo } from 'react'
import { Text } from 'react-native'
import { ImageGalleryContainer } from '@shared/images'
import { useAuth } from '@shared/hooks'
import { LoadingPanel } from '@shared/ui'
import { useUserProfile } from './'
import { ImageProvider } from '@shared/providers'

export const UserImagesView = () => {
	const { isAuthInitialized } = useAuth()
	const userToDisplay = useUserProfile()

	const currentUserId = useMemo(() => userToDisplay?.id, [userToDisplay?.id])

	if (!isAuthInitialized) return <LoadingPanel label='Authenticating...' />
	if (!userToDisplay || !userToDisplay.username) return <LoadingPanel label='Loading user images...' />
	if (!currentUserId) return <Text style={{ color: 'red', padding: 20 }}>User not found</Text>

	if (!userToDisplay?.id) {
		console.warn('Invalid userId passed to UserImageSection:')
		return null
	}

	return (
        <ImageProvider>
            <ImageGalleryContainer userId={userToDisplay.id} />
        </ImageProvider>
	)
}

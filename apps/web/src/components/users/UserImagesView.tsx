// apps/web/src/components/users/UserImagesView.tsx

import React, { useMemo } from 'react'
import { Text } from 'react-native'
import { ImageGalleryContainer } from '@/components'
import { useAuth } from '@/hooks'
import { LoadingScreen } from '@/screens'
import { useUserProfile } from '@/components'
import { ImageProvider } from '@/providers'

export const UserImagesView = () => {
	const { isAuthInitialized } = useAuth()
	const userToDisplay = useUserProfile()

	const currentUserId = useMemo(() => userToDisplay?.id, [userToDisplay?.id])

	if (!isAuthInitialized) return <LoadingScreen label='Authenticating...' />
	if (!userToDisplay || !userToDisplay.username) return <LoadingScreen label='Loading user images...' />
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

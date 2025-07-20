// apps/web/src/screens/UserImagesScreen.tsx

import React, { useMemo } from 'react'
import { Text } from 'react-native'
import { ImageGalleryContainer, Screen } from '@/components'
import { useAuth } from '@/hooks'
import { ImageProvider } from '@/providers'
import { LoadingScreen } from '@/screens'
import { useUserProfile } from '@/components'

export const UserImagesScreen = () => {
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
		<Screen>
            <ImageGalleryContainer userId={userToDisplay.id} />
		</Screen>
	)
}

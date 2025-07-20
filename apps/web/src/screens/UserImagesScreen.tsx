// apps/web/src/screens/UserImagesScreen.tsx

import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import { Column, ImageGalleryContainer, Screen } from '@/components'
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

	return (
		<Screen>
			<Column flex={1} spacing={15}>
				<UserImageSection userId={currentUserId} />
			</Column>
		</Screen>
	)
}

const UserImageSection = ({ userId }: { userId?: string }) => {
	if (!userId) {
		console.warn('Invalid userId passed to UserImageSection:', userId)
		return null
	}

	return (
		<View style={{ flex: 1 }}>
			<ImageProvider userId={userId}>
				<ImageGalleryContainer userId={userId} />
			</ImageProvider>
		</View>
	)
}

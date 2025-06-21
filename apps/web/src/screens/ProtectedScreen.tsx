import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { useAuth, useModal } from '../hooks'
import { SigninForm } from '@/components'

type ProtectedScreenNavProp = StackNavigationProp<RootStackParamList, 'Protected'>

export const ProtectedScreen = () => {
	const { user, isAuthenticated } = useAuth()
	const { showModal } = useModal()

	const navigation = useNavigation<ProtectedScreenNavProp>()

	useEffect(() => {
		if (!isAuthenticated) {
			showModal({ content: <SigninForm /> })
		}
	}, [isAuthenticated])

	if (!isAuthenticated) {
		// Not logged in, maybe show a message or navigate them to Sign In
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>You must be signed in to view this page.</Text>
			</View>
		)
	}

	// Otherwise, show the protected content!
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Welcome, {user?.username}!</Text>
		</View>
	)
}
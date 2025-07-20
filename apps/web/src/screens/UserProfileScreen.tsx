// apps/web/src/screens/UserProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, Column, Row, Screen } from '@/components'
import { useAuth, useTheme } from '@/hooks'
import { LoadingScreen } from '.'
import { useUserProfile } from '@/components'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { UserProfileStackParamList } from '@iam/types'

export const UserProfileScreen = () => {
	const { navigate } = useNavigation<StackNavigationProp<UserProfileStackParamList>>()
	const userToDisplay = useUserProfile()
	const { isAuthInitialized } = useAuth()
	// const { openFormModal } = useModal()
	const { theme } = useTheme()

	// const isOwnProfile = useMemo(
	// 	() => isAuthInitialized && authUser?.id === userToDisplay?.id,
	// 	[isAuthInitialized, authUser?.id, userToDisplay?.id]
	// )

	if (!isAuthInitialized) return <LoadingScreen label='Authenticating...' />
	if (!userToDisplay) return <LoadingScreen label='Loading user...' />

    // const showEditBioForm = () =>
    //     openFormModal(EditProfileForm, {}, { title: 'Edit Bio' })

	return (
		<Screen>
			<Column flex={1} spacing={15}>
				<Row spacing={10}>
					<Text style={[styles.text, { color: theme.colors.text }]}>
						{userToDisplay.bio || 'No bio yet.'}
					</Text>
					{/* {isOwnProfile && (
						<IconButton
							onPress={showEditBioForm}
							iconName='create-outline'
							iconSize={28}
						/>
					)} */}
				</Row>
				{/* <Button
					label='Images'
					onPress={() => navigate('UserImages')}
				/> */}
			</Column>
		</Screen>
	)
}

const styles = StyleSheet.create({
	text: { fontSize: 18, textAlign: 'left', flex: 1 },
})

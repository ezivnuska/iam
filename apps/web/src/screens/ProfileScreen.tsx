// apps/web/src/screens/UserProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import {
	Column,
	Row,
	IconButton,
    EditProfileForm,
    Screen,
} from '@/components'
import { useAuth, useModal, useTheme } from '@/hooks'
import { LoadingScreen } from './LoadingScreen'
import { Size } from '@iam/theme'

export const ProfileScreen = () => {

	const { user, isAuthInitialized } = useAuth()

	const { openFormModal } = useModal()
	const { theme } = useTheme()
    
	const openEditModal = () => {
		openFormModal(EditProfileForm, {}, { title: 'Edit Bio' })
	}

    if (!isAuthInitialized) {
        return <LoadingScreen label='Authenticating...' />
    }

	return (
        <Screen>
            <Column flex={1} spacing={15}>
                <Row spacing={10}>
                    <Text style={[styles.text, { color: theme.colors.text }]}>
                        {user?.bio || 'No bio yet.'}
                    </Text>
                    <IconButton
                        onPress={openEditModal}
                        iconName='create-outline'
                        iconSize={28}
                    />
                </Row>
            </Column>
        </Screen>
	)
}

const styles = StyleSheet.create({
	text: {
        paddingVertical: Size.S,
		fontSize: 18,
		textAlign: 'left',
		flex: 1,
	},
	username: {
		fontWeight: 'bold',
	},
	editButton: {
		marginLeft: 10,
	},
})

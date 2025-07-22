// apps/web/src/screens/UserProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import {
	Column,
	Row,
	IconButton,
    EditProfileForm,
} from '@/components'
import { useAuth, useModal, useTheme } from '@/hooks'
import { LoadingScreen } from '@/screens'
import { Size } from '@iam/theme'

export const ProfileView = () => {

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
        <Column flex={1} spacing={15} style={{ backgroundColor: theme.colors.background }}>
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

// apps/web/src/features/profile/components/UserProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Column, Row } from '@shared/grid'
import { LoadingPanel } from '@shared/ui'
import { IconButton } from '@shared/buttons'
import { EditProfileForm } from '@shared/forms'
import { useAuth } from '@features/auth'
import { useModal, useTheme } from '@shared/hooks'
import { Size } from '@iam/theme'

export const ProfileView = () => {

	const { user, isAuthInitialized } = useAuth()

	const { openFormModal } = useModal()
	const { theme } = useTheme()
    
	const openEditModal = () => {
		openFormModal(EditProfileForm, {}, { title: 'Edit Bio', fullscreen: true })
	}

    if (!isAuthInitialized) {
        return <LoadingPanel label='Authenticating...' />
    }

	return (
        <Column
            flex={1}
            spacing={15}
            style={{ backgroundColor: theme.colors.background }}
        >
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

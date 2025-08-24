// apps/web/src/features/profile/components/UserProfileScreen.tsx

import React, { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Column, Row } from '@shared/grid'
import { LoadingPanel } from '@shared/ui'
import { IconButton } from '@shared/buttons'
import { useAuth } from '@features/auth'
import { useTheme } from '@shared/hooks'
import { Size } from '@iam/theme'
import { BioForm } from './BioForm'

export const ProfileView = () => {

	const { user, isAuthInitialized } = useAuth()

    const [editing, setEditing] = useState(false)

	const { theme } = useTheme()

    if (!isAuthInitialized) {
        return <LoadingPanel label='Authenticating...' />
    }

	return (
        <Column
            flex={1}
            spacing={15}
            style={{ backgroundColor: theme.colors.background }}
        >
            {!editing ? (
                <Row spacing={10}>
                    <Text style={[styles.text, { color: theme.colors.text }]}>
                        {user?.bio || 'No bio yet.'}
                    </Text>
                    <IconButton
                        onPress={() => setEditing(true)}
                        iconName='create-outline'
                        iconSize={28}
                    />
                </Row>
            ) : <BioForm onComplete={() => setEditing(false)} />
        }
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

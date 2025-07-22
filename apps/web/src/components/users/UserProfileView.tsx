// apps/web/src/components/users/UserProfileView.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Column, Row } from '@/components'
import { useAuth, useTheme } from '@/hooks'
import { LoadingScreen } from '@/screens'
import { useUserProfile } from '@/components'

export const UserProfileView = ({ ...props }) => {
	const userToDisplay = useUserProfile()
	const { isAuthInitialized } = useAuth()
	const { theme } = useTheme()

	if (!isAuthInitialized) return <LoadingScreen label='Authenticating...' />
	if (!userToDisplay) return <LoadingScreen label='Loading user...' />
	
    return (
        <Column flex={1} spacing={15} style={{ backgroundColor: theme.colors.background }}>
            <Row spacing={10}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                    {userToDisplay.bio || 'No bio yet.'}
                </Text>
            </Row>
        </Column>
	)
}

const styles = StyleSheet.create({
	text: { fontSize: 18, textAlign: 'left', flex: 1 },
})

// apps/web/src/features/users/components/UserProfileView.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Column, Row } from '@shared/grid'
import { useAuth, useTheme } from '@shared/hooks'
import { LoadingPanel } from '@shared/ui'
import { useUserProfile } from '../'
import { paddingHorizontal, paddingVertical } from '@iam/theme'

export const UserProfileView = ({ ...props }) => {
	const userToDisplay = useUserProfile()
	const { isAuthInitialized } = useAuth()
	const { theme } = useTheme()

	if (!isAuthInitialized) return <LoadingPanel label='Authenticating...' />
	if (!userToDisplay) return <LoadingPanel label='Loading user...' />
	
    return (
        <Column
            flex={1}
            spacing={15}
            paddingVertical={paddingVertical}
            paddingLeft={paddingHorizontal}
            style={{ backgroundColor: theme.colors.background }}
        >
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

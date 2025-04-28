// packages/screens/src/screens/HomeScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader, PageLayout, Stack } from '@ui'
import { useAuth } from '@providers'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type ProfileScreenNavProp = StackNavigationProp<RootStackParamList, 'Profile'>

export const ProfileScreen = () => {
    const { user } = useAuth()
    const navigation = useNavigation<ProfileScreenNavProp>()

	return (
		<PageLayout>
            <PageHeader title={`Profile: ${user?.username || ''}`} />
            <Stack
                spacing={10}
                align='flex-start'
            >
                <Text style={[styles.text, styles.username]}>{user?.username}</Text>
                <Text style={[styles.text, styles.email]}>{user?.email}</Text>
            </Stack>
		</PageLayout>
	)
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        textAlign: 'left',
    },
    username: {
        flex: 1,
        fontWeight: 'bold',
    },
    email: {
        color: '#77f',
        flex: 1,
    },
})
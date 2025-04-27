// packages/screens/src/screens/HomeScreen.tsx

import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { PageHeader, PageLayout } from '@ui'
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
		</PageLayout>
	)
}
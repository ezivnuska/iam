// packages/screens/src/screens/DetailsScreen.tsx

import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button, PageHeader, PageLayout } from '@ui'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type DetailsScreenNavProp = StackNavigationProp<RootStackParamList, 'Details'>

export const DetailsScreen = () => {
	const navigation = useNavigation<DetailsScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	return (
		<PageLayout>
			<PageHeader title='Details' />
			<Button label='Go Home' onPress={goToHome} />
		</PageLayout>
	)
}
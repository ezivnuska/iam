// packages/screens/src/screens/DetailsScreen.tsx

import React, { useCallback } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { PageLayout } from '@ui'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'

type DetailsScreenNavProp = StackNavigationProp<RootStackParamList, 'Details'>

export const DetailsScreen = () => {
	const navigation = useNavigation<DetailsScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	return (
		<PageLayout
			header={<View style={{ backgroundColor: 'red' }}>Header</View>}
			footer={<View style={{ backgroundColor: 'green' }}>Footer</View>}
			padding={{ sm: 12, md: 24 }}
		>
			<Text>Details</Text>
			<Button title="Go Home" onPress={goToHome} />
		</PageLayout>
	)
}
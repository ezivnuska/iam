// packages/screens/src/screens/HomeScreen.tsx

import React, { useCallback } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'
import { PageLayout } from '@ui'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

export const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavProp>()

	const goToDetails = useCallback(() => {
		navigation.navigate('Details', { id: '123' })
	}, [navigation])

	return (
		<PageLayout
			header={<View style={{ backgroundColor: 'red' }}>Header</View>}
			footer={<View style={{ backgroundColor: 'green' }}>Footer</View>}
			padding={{ sm: 12, md: 24 }}
		>
			<Text>Home</Text>
			<Button title="Go to Details" onPress={goToDetails} />
		</PageLayout>
	)
}
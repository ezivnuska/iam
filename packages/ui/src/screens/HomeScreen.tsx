import React, { useCallback } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'
import { PageLayout } from '../components'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

export const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavProp>()

	const goToDetail = useCallback(() => {
		navigation.navigate('Details', { id: '123' })
	}, [navigation])

	return (
		<PageLayout>
			<Text>Home</Text>
			<Button title="Go to Detail" onPress={goToDetail} />
		</PageLayout>
	)
}
import React, { useCallback } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'

type DetailsScreenNavProp = StackNavigationProp<RootStackParamList, 'Details'>

export const DetailsScreen = () => {
	const navigation = useNavigation<DetailsScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	return (
		<View>
			<Text>Details</Text>
			<Button title="Go Home" onPress={goToHome} />
		</View>
	)
}
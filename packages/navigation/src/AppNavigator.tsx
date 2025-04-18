import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { DetailsScreen, HomeScreen } from '@ui'
import type { RootStackParamList } from '@types'

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={() => <HomeScreen />} />
				<Stack.Screen name="Details" component={() => <DetailsScreen />} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
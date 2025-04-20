// packages/navigation/src/AppNavigator.tsx

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
	DetailsScreen,
	ForgotPasswordScreen,
	HomeScreen,
	LoginScreen,
	RegisterScreen,
	ResetPasswordScreen,
} from '@screens'
import type { RootStackParamList } from '@types'
import { navigationRef } from '@services/navigation'
import * as Linking from 'expo-linking'

const linking = {
	prefixes: ['iameric://', 'https://iameric.me'],
	config: {
		screens: {
			Details: '/details',
			ForgotPassword: 'forgot-password',
			Home: '/',
			Login: 'login',
			Register: 'register',
			ResetPassword: 'reset-password/:token',
		},
	},
}

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
	return (
		<NavigationContainer ref={navigationRef} linking={linking}>
			<Stack.Navigator
				initialRouteName='Home'
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name='Details' component={() => <DetailsScreen />} />
				<Stack.Screen name='ForgotPassword' component={() => <ForgotPasswordScreen />} />
				<Stack.Screen name='Home' component={() => <HomeScreen />} />
				<Stack.Screen name='Login' component={() => <LoginScreen />} />
				<Stack.Screen name='Register' component={() => <RegisterScreen />} />
				<Stack.Screen name='ResetPassword' component={() => <ResetPasswordScreen />} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
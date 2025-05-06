// apps/web/src/app.tsx

import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppProviders } from './providers'
import { AppNavigator, navigationRef } from './navigation'
import * as Linking from 'expo-linking'

const linking = {
    prefixes: ['http://localhost:3000', 'https://iameric.me'],
    config: {
        screens: {
            Chat: 'chat',
            Details: 'details',
            ForgotPassword: 'forgot-password',
            Home: '/',
            Signin: 'signin',
            Signup: 'signup',
            ResetPassword: 'reset-password/:token',
            UserList: 'users',
            Profile: 'profile',
        },
    },
}
export default function App() {
	return (
		<GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <NavigationContainer ref={navigationRef} linking={linking}>
                    <AppProviders>
                        <AppNavigator />
                    </AppProviders>
                </NavigationContainer>
            </SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
})  
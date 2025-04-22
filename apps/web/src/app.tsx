// apps/web/src/App.tsx

import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppProviders } from './providers'
import { AppNavigator } from '@navigation'

export default function App() {

	return (
		<GestureHandlerRootView style={styles.container}>
			<SafeAreaProvider>
				<AppProviders>
                    <AppNavigator />
				</AppProviders>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
})  
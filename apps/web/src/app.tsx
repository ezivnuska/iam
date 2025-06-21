// apps/web/src/app.tsx

import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppProviders } from './providers'
import { AppNavigator } from './navigation'

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
            <AppProviders>
                <View style={{ flex: 1 }}>
                    <AppNavigator />
                </View>
            </AppProviders>
		</GestureHandlerRootView>
	)
}

export default App
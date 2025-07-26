// apps/web/src/app/App.tsx

import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider, ModalProvider, PostsProvider, SocketProvider, ThemeProvider } from '@shared/providers'
import { AuthLayer } from '@features/auth'
import { AppNavigator } from '@app/navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PostsProvider>
                    <ThemeProvider>
                        <SocketProvider>
                            <AuthProvider>
                                <ModalProvider>
                                    <AuthLayer>
                                        <View style={{ flex: 1, borderWidth: 0.1, borderColor: 'transparent' }}>
                                            <AppNavigator />
                                        </View>
                                    </AuthLayer>
                                </ModalProvider>
                            </AuthProvider>
                        </SocketProvider>
                    </ThemeProvider>
                </PostsProvider>
            </SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

export default App

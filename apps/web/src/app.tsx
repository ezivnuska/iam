// apps/web/src/app.tsx

import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthLayer, AuthProvider, ModalProvider, PostsProvider, SocketProvider, ThemeProvider } from '@/providers'
import { AppNavigator } from '@/navigation'
import { SafeAreaView } from 'react-native-safe-area-context'

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <SocketProvider>
                    <AuthProvider>
                        <ModalProvider>
                            <AuthLayer>
                                <PostsProvider>
                                    <SafeAreaView style={{ flex: 1, borderWidth: 0.1, borderColor: 'transparent' }}>
                                        <AppNavigator />
                                    </SafeAreaView>
                                </PostsProvider>
                            </AuthLayer>
                        </ModalProvider>
                    </AuthProvider>
                </SocketProvider>
            </ThemeProvider>
		</GestureHandlerRootView>
	)
}

export default App

// apps/web/src/app/App.tsx

import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MemoryProvider, ModalProvider, PostsProvider, SocketProvider, ThemeProvider } from '@shared/providers'
import { AuthProvider } from '@features/auth'
import { AppNavigator } from '@app/navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <MemoryProvider>
                    <PostsProvider>
                        <ThemeProvider>
                            <SocketProvider>
                                <AuthProvider>
                                    <ModalProvider>
                                        <AppNavigator />
                                    </ModalProvider>
                                </AuthProvider>
                            </SocketProvider>
                        </ThemeProvider>
                    </PostsProvider>
                </MemoryProvider>
            </SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

export default App

// apps/web/src/app/App.tsx

import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ModalProvider, PostsProvider, SocketProvider, ThemeProvider } from '@shared/providers'
import { MemoryProvider } from '@features/memory'
import { AuthProvider } from '@features/auth'
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
                                        <MemoryProvider>
                                            <AppNavigator />
                                        </MemoryProvider>
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

// apps/web/src/app.tsx

import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthLayer, AuthProvider, ModalProvider, PostsProvider, SocketProvider, ThemeProvider } from '@/providers'
import { AppNavigator } from '@/navigation'

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <SocketProvider>
                    <AuthProvider>
                        <ModalProvider>
                            <AuthLayer>
                                <PostsProvider>
                                    <View style={{ flex: 1, borderWidth: 0.1, borderColor: 'transparent' }}>
                                        <AppNavigator />
                                    </View>
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

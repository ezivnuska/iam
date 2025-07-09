// apps/web/src/app.tsx

import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthLayer, AuthProvider, ModalProvider, SocketProvider } from '@/providers'
import { AppNavigator } from '@/navigation'
import { PostsProvider } from '@/providers'

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
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
		</GestureHandlerRootView>
	)
}

export default App

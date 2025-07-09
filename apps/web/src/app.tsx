// apps/web/src/app.tsx

import React, { useEffect } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider, ModalProvider, SocketProvider } from './providers'
import { AuthLayer } from '@/components'
import { AppNavigator } from './navigation'

const App = () => {

    useEffect(() => {
        console.log('App mounted')
        return () => console.log('App unmounted')
    }, [])
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
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
		</GestureHandlerRootView>
	)
}

export default App

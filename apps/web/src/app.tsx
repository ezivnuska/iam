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
            <ModalProvider>
                <SocketProvider>
                    <AuthProvider>
                        <AuthLayer>
                            <View style={{ flex: 1 }}>
                                <AppNavigator />
                            </View>
                        </AuthLayer>
                    </AuthProvider>
                </SocketProvider>
            </ModalProvider>
		</GestureHandlerRootView>
	)
}

export default App

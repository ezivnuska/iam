// apps/web/src/App.tsx

import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppNavigator } from '@navigation'

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
        <AppNavigator />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})
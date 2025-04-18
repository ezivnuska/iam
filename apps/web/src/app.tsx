// src/App.tsx

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PageLayout } from '@ui'
import { AppNavigator } from '@navigation'

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
        <AppNavigator />
        {/* <PageLayout
            header={<View style={styles.header}>Header</View>}
            footer={<View style={styles.footer}>Footer</View>}
            padding={{ sm: 12, md: 24 }}
        >
            <View style={styles.content}>Main</View>
        </PageLayout> */}
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 100,
    },
    content: {
        flex: 1,
    },
    footer: {
        height: 100,
    },
})
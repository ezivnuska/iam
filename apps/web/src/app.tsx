// src/App.tsx
import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { PageLayout } from '@ui'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
        <PageLayout
            header={<View style={styles.header}>Header</View>}
            footer={<View style={styles.footer}>Footer</View>}
            padding={{ sm: 12, md: 24 }}
        >
            <View style={styles.content}>Main</View>
        </PageLayout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 100,
        backgroundColor: 'red',
    },
    content: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    footer: {
        height: 100,
        backgroundColor: 'green',
    },
})
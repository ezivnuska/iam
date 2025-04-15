// src/App.tsx
import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { PageLayout } from '@ui'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
        <PageLayout
            header={<View style={styles.header} />}
            footer={<View style={styles.footer} />}
            padding={{ sm: 12, md: 24 }}
        >
            <View style={styles.content} />
        </PageLayout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 5,
        borderStyle: 'dotted',
    },
    header: {
        height: 100,
        backgroundColor: 'green',
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
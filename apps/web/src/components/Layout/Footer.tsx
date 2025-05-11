// packages/ui/src/components/layouts/PageLayout/Footer.tsx

import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { MAX_WIDTH } from './constants'

export const Footer = () => {
	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Text style={styles.copy}>&copy; iameric</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
    },
    maxWidthContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: MAX_WIDTH,
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    copy: {
        fontSize: 18,
        color: '#fff',
    },
})
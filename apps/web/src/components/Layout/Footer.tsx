// packages/ui/src/components/layouts/PageLayout/Footer.tsx

import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Row } from '@/components'
import { MAX_WIDTH } from './constants'
import { Size } from '@/styles'

export const Footer = () => {
	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    spacing={25}
                    align='center'
                    justify='space-between'
                    paddingHorizontal={Size.M}
                    wrap={false}
                    style={{ zIndex: 200, flexWrap: 'nowrap' }}
                >
                    <Text style={styles.copy}>&copy; iameric</Text>
                </Row>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Size.S,
        backgroundColor: '#fff',
    },
    maxWidthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: MAX_WIDTH,
        alignSelf: 'center',
    },
    copy: {
        fontSize: 18,
        color: '#000',
    },
})
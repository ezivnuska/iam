// packages/ui/src/components/layouts/PageLayout/Footer.tsx

import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Row } from '@/components'
import { MAX_WIDTH } from './constants'
import { resolveResponsiveProp } from '@/styles'

export const Footer = () => {
    const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })
	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    spacing={25}
                    align='center'
                    justify='space-between'
                    paddingHorizontal={paddingHorizontal}
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
        paddingVertical: 10,
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
// packages/ui/src/components/layouts/PageLayout/Footer.tsx

import React from 'react'
import { Text, Pressable, StyleSheet, View } from 'react-native'
import { Row } from '@/components'
import { useNavigation } from '@react-navigation/native'
import { MAX_WIDTH } from './constants'
import { Size } from '@/styles'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type NavProp = StackNavigationProp<RootStackParamList>

export const Footer = () => {
    const navigation = useNavigation<NavProp>()
	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    align='center'
                    justify='space-between'
                    wrap={false}
                    style={{ zIndex: 200, flexWrap: 'nowrap' }}
                >
                    <Text style={styles.copy}>&copy; iameric</Text>
                    <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={styles.copy}>Privacy Policy</Text>
                    </Pressable>
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
        width: '100%',
        maxWidth: MAX_WIDTH,
        marginHorizontal: 'auto',
        paddingHorizontal: Size.M,
    },
    copy: {
        fontSize: 18,
        color: '#000',
    },
})
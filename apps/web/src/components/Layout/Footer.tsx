// packages/ui/src/components/layouts/PageLayout/Footer.tsx

import React from 'react'
import { Text, Pressable, StyleSheet, View } from 'react-native'
import { KoFiPanel, Row } from '@/components'
import { useNavigation } from '@react-navigation/native'
import { MAX_WIDTH } from './constants'
import { Size } from '@/styles'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { useModal } from '@/hooks'

type NavProp = StackNavigationProp<RootStackParamList>

export const Footer = () => {
    const navigation = useNavigation<NavProp>()
    const { showModal } = useModal()
    const showKofiModal = () => {
        showModal(<KoFiPanel />)
    }
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
                    <Text style={[styles.text, styles.copy]}>&copy; iameric</Text>
                    <Pressable onPress={showKofiModal} style={styles.supportButton}>
                        <Text style={[styles.text, styles.support]}>Support</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={[styles.text, styles.privacy]}>Privacy Policy</Text>
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
    text: {
        lineHeight: 24,
    },
    copy: {
        fontSize: 12,
        color: '#aaa',
    },
    supportButton: {
        fontSize: 14,
        paddingHorizontal: Size.S,
        backgroundColor: '#3a3',
        borderRadius: 4,
    },
    support: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    privacy: {
        fontSize: 12,
        color: '#aaa',
    },
})
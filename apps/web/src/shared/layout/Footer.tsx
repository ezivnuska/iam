// apps/web/src/shared/layout/Footer.tsx

import React from 'react'
import { Text, Pressable, StyleSheet, View } from 'react-native'
import { Row } from '@shared/grid'
import { DonationModal } from '@shared/modals'
import { useNavigation } from '@react-navigation/native'
import { MAX_WIDTH } from './constants'
import { paddingHorizontal, Size } from '@iam/theme'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { useModal } from '@shared/hooks'

type NavProp = StackNavigationProp<RootStackParamList>

export const Footer = () => {
    const navigation = useNavigation<NavProp>()
    const { showModal } = useModal()
    const showDonationModal = () => showModal(<DonationModal />, true)
	return (
        <Row flex={1} align='center' style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    align='center'
                    justify='space-between'
                    wrap={false}
                    style={{ zIndex: 200, flexWrap: 'nowrap' }}
                >
                    <Text style={[styles.text, styles.copy]}>&copy; iameric</Text>
                    <Pressable onPress={showDonationModal} style={styles.supportButton}>
                        <Text style={[styles.text, styles.support]}>Support</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={[styles.text, styles.privacy]}>Privacy Policy</Text>
                    </Pressable>
                </Row>
            </View>
        </Row>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: Size.XS,
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: MAX_WIDTH,
        marginHorizontal: 'auto',
        paddingHorizontal: paddingHorizontal,
    },
    text: {
        lineHeight: 24,
    },
    copy: {
        fontSize: 12,
        color: '#eee',
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
        color: '#eee',
    },
})
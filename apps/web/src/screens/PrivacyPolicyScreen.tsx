// apps/web/src/screens/PrivacyPolicyScreen.tsx

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Heading } from '@/components'
import { paddingHorizontal } from '@iam/theme'

export const PrivacyPolicyScreen = () => {

	return (
		<View style={{ flex: 1 }}>
            <Heading
                title='Privacy Policy'
                subtitle='Our policy on privacy'
            />
            <Text style={styles.text}>This app collects no personal data. That's it.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	text: {
        flex: 1,
		fontSize: 16,
		lineHeight: 30,
		textAlign: 'left',
        paddingHorizontal: paddingHorizontal,
        color: '#eee',
	},
})
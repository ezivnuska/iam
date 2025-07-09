// apps/web/src/screens/ProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Heading, PageLayout } from '@/components'
import { paddingHorizontal } from '@/styles'

export const PrivacyPolicyScreen = () => {

	return (
		<PageLayout>
            <Heading
                title='Privacy Policy'
                subtitle='Our policy on privacy'
            />
            <Text style={styles.text}>This app collects no personal data. That's it.</Text>
		</PageLayout>
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
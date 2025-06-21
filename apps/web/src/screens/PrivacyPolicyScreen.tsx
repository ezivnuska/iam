// apps/web/src/screens/ProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { PageLayout, PageHeader } from '@/components'
import { paddingHorizontal, Size } from '@/styles'

export const PrivacyPolicyScreen = () => {

	return (
		<PageLayout>
            <PageHeader
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
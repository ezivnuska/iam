// apps/web/src/screens/ProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { PageLayout } from '@/components'
import { paddingHorizontal, Size } from '@/styles'

export const PrivacyPolicyScreen = () => {

	return (
		<PageLayout>
            <Text style={styles.text}>This app collects no personal data. It uses Facebook Login for authentication and accesses public Instagram data in accordance with Facebook’s Platform Policy.</Text>
		</PageLayout>
	)
}

const styles = StyleSheet.create({
	text: {
        flex: 1,
		fontSize: 18,
		textAlign: 'left',
        paddingHorizontal: paddingHorizontal,
	},
})
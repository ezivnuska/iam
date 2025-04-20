// packages/ui/src/components/layouts/PageLayout/SectionLayout.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MAX_WIDTH } from './constants'

export interface SectionLayoutProps {
	title: string
	subtitle?: string
	backgroundColor: string
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
	title,
	subtitle,
	backgroundColor,
}) => {
	return (
		<View style={[styles.container, { backgroundColor }]}>
			<View style={styles.maxWidthContainer}>
				<Text style={styles.title}>{title}</Text>
				{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexShrink: 0,
		paddingVertical: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		color: 'white',
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 16,
		color: 'white',
		marginTop: 5,
	},
	maxWidthContainer: {
		width: '100%',
		maxWidth: MAX_WIDTH,
		paddingHorizontal: 10,
		alignSelf: 'center',
	},
})
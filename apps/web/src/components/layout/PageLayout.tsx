// apps/web/src/components/layout/PageLayout.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Header, Footer } from '@/components'
import { Size } from '@/styles'
import { MAX_WIDTH } from './constants'
import type { PageLayoutProps } from './types'

export const PageLayout: React.FC<PageLayoutProps> = ({
	children,
}) => {

	return (
		<View style={styles.outerContainer}>
			<View>
				<Header />
			</View>

			<View style={styles.contentWrapper}>
				{children}
			</View>

			<View>
				<Footer />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
        backgroundColor: '#000',
	},
	contentWrapper: {
        flex: 1,
		width: '100%',
		maxWidth: MAX_WIDTH,
		alignSelf: 'center',
	},
})

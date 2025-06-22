// apps/web/src/components/Layout/PageLayout.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Header, Footer } from '@/components'
import { useDeviceInfo } from '@/hooks'
import { MAX_WIDTH } from './constants'
import type { PageLayoutProps } from './types'

export const PageLayout: React.FC<PageLayoutProps> = ({
	children,
}) => {
	const { height } = useDeviceInfo()

	return (
		<View style={styles.outerContainer}>
			<View style={styles.header}>
				<Header />
			</View>

			<View style={[styles.contentWrapper, { height: height - 100 }]}>
				{children}
			</View>

			<View style={styles.footer}>
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
	header: {
		height: 50,
	},
	footer: {
		height: 50,
	},
	contentWrapper: {
		width: '100%',
		maxWidth: MAX_WIDTH,
		alignSelf: 'center',
	},
})

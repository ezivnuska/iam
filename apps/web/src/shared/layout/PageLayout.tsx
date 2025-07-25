// apps/web/src/shared/layout/PageLayout.tsx

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Header, Footer } from '@shared/layout'
import { MAX_WIDTH } from './constants'
import type { PageLayoutProps } from '@shared/layout'
import { useTheme } from '@shared/hooks'

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	const { theme } = useTheme()

	return (
		<View style={[styles.outerContainer, { backgroundColor: theme.colors.background }]}>
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
	},
	contentWrapper: {
		flex: 1,
		width: '100%',
		maxWidth: MAX_WIDTH,
		alignSelf: 'center',
	},
})

import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Header, Footer } from '.'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MAX_WIDTH } from './constants'
import { useDeviceInfo } from '@/hooks'

interface PageLayoutProps {
	children: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	const { height } = useDeviceInfo()
	return (
		<SafeAreaView style={styles.container}>
			<Header />

			<ScrollView
				style={[styles.mainContent, { maxHeight: height - 100 }]}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
                {children}
			</ScrollView>

			<Footer />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: '#fff',
	},
	mainContent: {
		flex: 1,
		// backgroundColor: '#777',
        // margin: 0,
        // padding: 0,
	},
	scrollContent: {
		flex: 1,
		width: '100%',
		maxWidth: MAX_WIDTH,
		marginHorizontal: 'auto',
        paddingHorizontal: 16,
	},
})
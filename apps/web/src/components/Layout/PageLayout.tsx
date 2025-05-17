import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Header, Footer } from '.'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MAX_WIDTH } from './constants'
import { useDeviceInfo } from '@/hooks'
import { resolveResponsiveProp } from '@/styles'

interface PageLayoutProps {
	children: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	const { height } = useDeviceInfo()
    const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })
	return (
		<SafeAreaView style={styles.container}>
			<Header />

			<ScrollView
				style={[styles.mainContent, { maxHeight: height - 100 }]}
				contentContainerStyle={[styles.scrollContent, { paddingHorizontal }]}
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
        backgroundColor: '#000',
	},
	mainContent: {
		flex: 1,
        backgroundColor: '#fff',
	},
	scrollContent: {
		flex: 1,
		width: '100%',
		maxWidth: MAX_WIDTH,
		marginHorizontal: 'auto',
	},
})
// apps/web/src/shared/scrolling/AutoScrollView.tsx

import React, { useRef, useEffect } from 'react'
import {
	View,
	ScrollView,
	StyleSheet,
	ScrollViewProps,
} from 'react-native'
import { paddingHorizontal, paddingVertical } from '@iam/theme'

interface AutoScrollViewProps extends ScrollViewProps {
	children: React.ReactNode
	dependencies?: any[]
}

export const AutoScrollView: React.FC<AutoScrollViewProps> = ({
	children,
	dependencies = [],
	...props
}) => {
	const scrollRef = useRef<ScrollView>(null)

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollToEnd({ animated: true })
		}
	}, dependencies)

	return (
		<View style={[styles.container, props?.style]}>
			<ScrollView
				ref={scrollRef}
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				{...props}
			>
				{children}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical,
		paddingHorizontal,
	},
})

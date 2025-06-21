// apps/web/src/components/InfiniteScrollView.tsx

import React, { useRef } from 'react'
import {
	View,
	ScrollView,
	StyleSheet,
	NativeSyntheticEvent,
	NativeScrollEvent,
} from 'react-native'

interface InfiniteScrollViewProps {
	children: React.ReactNode
	onScrollNearBottom?: () => void
	threshold?: number
}

export const InfiniteScrollView: React.FC<InfiniteScrollViewProps> = ({
	children,
	onScrollNearBottom,
	threshold = 100,
}) => {
	const triggeredRef = useRef(false)

	const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent
		const distanceFromBottom =
			contentSize.height - (contentOffset.y + layoutMeasurement.height)

		if (distanceFromBottom < threshold) {
			if (!triggeredRef.current) {
				triggeredRef.current = true
				onScrollNearBottom?.()
			}
		} else {
			triggeredRef.current = false
		}
	}

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				onScroll={handleScroll}
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
	},
})

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
	threshold?: number
	onScrollNearBottom?: () => void
    onScrollDirectionChange?: (direction: 'up' | 'down') => void
    onScrolledToTop?: () => void
    onScrolledToBottom?: () => void
}

export const InfiniteScrollView: React.FC<InfiniteScrollViewProps> = ({
	children,
	onScrollNearBottom,
	onScrollDirectionChange,
    onScrolledToTop,
    onScrolledToBottom,
	...props
}) => {
	const scrollOffset = useRef(0)

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
		const currentOffset = contentOffset.y
		const direction = currentOffset > scrollOffset.current ? 'down' : 'up'
	
		if (Math.abs(currentOffset - scrollOffset.current) > 10) {
			onScrollDirectionChange?.(direction)
		}
		scrollOffset.current = currentOffset
	
		if (
			currentOffset + layoutMeasurement.height >= contentSize.height - 200
		) {
			onScrollNearBottom?.()
		}
	
		if (currentOffset <= 0) {
			onScrolledToTop?.()
		}
	
		if (
			Math.abs(currentOffset + layoutMeasurement.height - contentSize.height) < 5
		) {
			onScrolledToBottom?.()
		}
	}	

	return (
		<ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			{...props}
		>
			{children}
		</ScrollView>
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

// apps/web/src/components/Layout/AnimatedPageLayout.tsx

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Header, Footer } from '@/components'
import { useDeviceInfo } from '@/hooks'
import { MAX_WIDTH } from './constants'
import type { PageLayoutProps } from './types'

export interface AnimatedPageLayoutHandles {
	showHeaderFooter: () => void
	hideHeaderFooter: () => void
}

export const AnimatedPageLayout = forwardRef<AnimatedPageLayoutHandles, PageLayoutProps>(
	({ children }, ref) => {
		const { height: deviceHeight } = useDeviceInfo()

		const headerAnim = useRef(new Animated.Value(0)).current
		const footerAnim = useRef(new Animated.Value(0)).current
		const contentHeightAnim = useRef(new Animated.Value(deviceHeight - 100)).current
		const marginTopAnim = useRef(new Animated.Value(50)).current
		const marginBottomAnim = useRef(new Animated.Value(50)).current

		const [headerHeight, setHeaderHeight] = useState(50)
		const [footerHeight, setFooterHeight] = useState(50)

		const animateLayout = (show: boolean) => {
			const toHeader = show ? 0 : -headerHeight
			const toFooter = show ? 0 : footerHeight
			const toContentHeight = show
				? deviceHeight - (headerHeight + footerHeight)
				: deviceHeight

			Animated.parallel([
				Animated.timing(headerAnim, {
					toValue: toHeader,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(footerAnim, {
					toValue: toFooter,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(contentHeightAnim, {
					toValue: toContentHeight,
					duration: 250,
					useNativeDriver: false,
				}),
				Animated.timing(marginTopAnim, {
					toValue: show ? headerHeight : 0,
					duration: 250,
					useNativeDriver: false,
				}),
				Animated.timing(marginBottomAnim, {
					toValue: show ? footerHeight : 0,
					duration: 250,
					useNativeDriver: false,
				}),
			]).start()
		}

		useImperativeHandle(ref, () => ({
			showHeaderFooter: () => animateLayout(true),
			hideHeaderFooter: () => animateLayout(false),
		}))

		useEffect(() => {
			const initialHeight = deviceHeight - headerHeight - footerHeight
			contentHeightAnim.setValue(initialHeight)
			marginTopAnim.setValue(headerHeight)
			marginBottomAnim.setValue(footerHeight)
		}, [deviceHeight, headerHeight, footerHeight])

		return (
			<View style={styles.outerContainer}>
				<Animated.View
					style={[
						styles.header,
						{ transform: [{ translateY: headerAnim }] },
					]}
					onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
				>
					<Header />
				</Animated.View>

				<Animated.View
					style={[
						styles.contentWrapper,
						{
							height: contentHeightAnim,
							marginTop: marginTopAnim,
							marginBottom: marginBottomAnim,
						},
					]}
				>
					{children}
				</Animated.View>

				<Animated.View
					style={[
						styles.footer,
						{ transform: [{ translateY: footerAnim }] },
					]}
					onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}
				>
					<Footer />
				</Animated.View>
			</View>
		)
	}
)

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		backgroundColor: '#000',
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	footer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	contentWrapper: {
		width: '100%',
		maxWidth: MAX_WIDTH,
		alignSelf: 'center',
		overflow: 'hidden',
	},
})

import React from 'react'
import {
	View,
	StyleSheet,
	ScrollView,
	ViewStyle,
	StyleProp,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Grid from './Grid'
import type { ResponsiveProp } from '../types/responsive'
import { getResolvedPadding } from '../utils/padding'

const MAX_WIDTH = 900

export type PageLayoutProps = {
	header?: React.ReactNode
	footer?: React.ReactNode
	children: React.ReactNode
	padding?: ResponsiveProp<number>
	paddingHorizontal?: ResponsiveProp<number>,
	paddingVertical?: ResponsiveProp<number>,
	paddingTop?: ResponsiveProp<number>,
	paddingBottom?: ResponsiveProp<number>,
	paddingLeft?: ResponsiveProp<number>,
	paddingRight?: ResponsiveProp<number>,
	style?: StyleProp<ViewStyle>
}

export const PageLayout: React.FC<PageLayoutProps> = ({
	header,
	footer,
	children,
	padding,
	paddingHorizontal,
	paddingVertical,
	paddingTop,
	paddingBottom,
	paddingLeft,
	paddingRight,
	style,
}) => {
	const insets = useSafeAreaInsets()
	const paddingStyle = getResolvedPadding({
		padding,
		paddingHorizontal,
		paddingVertical,
		paddingTop: paddingTop ?? insets.top,
		paddingBottom: paddingBottom ?? insets.bottom,
		paddingLeft: paddingLeft ?? insets.left,
		paddingRight: paddingRight ?? insets.right,
	})

	return (
		<Grid
			direction="column"
			flex={1}
			style={[styles.container, style]}
		>
			{header && (
				<View style={styles.header}>
					<View style={styles.maxWidthContainer}>{header}</View>
				</View>
			)}
			
			<ScrollView
				contentContainerStyle={[
					styles.main,
					paddingStyle,
				]}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				style={{ flex: 1 }}
			>
				<View style={styles.maxWidthContainer}>
					{children}
				</View>
			</ScrollView>

			{footer && (
				<View style={styles.footer}>
					<View style={styles.maxWidthContainer}>{footer}</View>
				</View>
			)}
		</Grid>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		width: '100%',
	},
	header: {
		flexShrink: 0,
		// paddingVertical: 12,
		// paddingHorizontal: 16,
		backgroundColor: 'red',
	},
	main: {
		flexGrow: 1,
        backgroundColor: 'yellow',
	},
	footer: {
		flexShrink: 0,
		// paddingVertical: 12,
		// paddingHorizontal: 16,
		backgroundColor: 'green',
	},
	maxWidthContainer: {
		width: '100%',
		maxWidth: MAX_WIDTH,
		alignSelf: 'center',
	},
})
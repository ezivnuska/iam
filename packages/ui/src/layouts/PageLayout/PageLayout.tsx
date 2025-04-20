// packages/ui/src/components/layouts/PageLayout/PageLayout.tsx

import React from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Grid } from '../../components/Grid'
import { Header } from './Header'
import { MainContent } from './MainContent'
import { Footer } from './Footer'
import { getResolvedPadding } from '../../utils/padding'
import { MAX_WIDTH } from './constants'
import { PageLayoutProps } from './types'

export const PageLayout: React.FC<PageLayoutProps> = ({
	children,
	padding = { sm: 12, md: 24 },
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
			direction='column'
			flex={1}
			style={[styles.container, style]}
		>
            <Header
                title='iameric'
                subtitle='This is my site'
            />
			
			<MainContent style={paddingStyle}>
                {children}
            </MainContent>

            <Footer title='Footer' />

		</Grid>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		width: '100%',
	},
    scrollView: {
        flex: 1,
    },
	main: {
		flexGrow: 1,
        backgroundColor: 'yellow',
	},
	maxWidthContainer: {
        width: '100%',
		maxWidth: MAX_WIDTH,
        paddingHorizontal: 10,
		alignSelf: 'center',
	},
})
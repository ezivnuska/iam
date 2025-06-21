// apps/web/src/components/layout/FlexBox.tsx

import React from 'react'
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native'
import { getResolvedPadding, resolveResponsiveProp, type ResponsiveProp } from '@/styles'
import { useBreakpoint } from '@/hooks'
import { FlexProps, PaddingProps } from '@/types'

export interface FlexBoxProps extends FlexProps, PaddingProps {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
	align?: ResponsiveProp<'flex-start' | 'flex-end' | 'center' | 'stretch'>
}

const FlexBox: React.FC<FlexBoxProps> = ({
	flex,
	spacing,
	align,
	justify,
	direction,
	wrap,
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
	const resolvedSpacing = useBreakpoint(spacing) ?? 0
	const resolvedAlign = useBreakpoint(align)
	const resolvedJustify = useBreakpoint(justify)
	const resolvedDirection = useBreakpoint(direction)
	const resolvedWrap = useBreakpoint(wrap)

	const layoutStyle: ViewStyle = {
		flex: resolveResponsiveProp(flex),
		flexDirection: resolvedDirection,
		alignItems: resolvedAlign,
		justifyContent: resolvedJustify,
		flexWrap: resolvedWrap ? 'wrap' : 'nowrap',
		gap: resolvedSpacing,

		...getResolvedPadding({
            padding,
            paddingHorizontal,
            paddingVertical,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
		}),
	}
    
	return <View style={StyleSheet.flatten([layoutStyle, style])}>{children}</View>
}

export default FlexBox
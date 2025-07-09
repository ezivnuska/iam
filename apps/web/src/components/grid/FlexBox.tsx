// apps/web/src/components/grid/FlexBox.tsx

import React from 'react'
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native'
import { getResolvedPadding, resolveResponsiveProp } from '@/styles'
import { useBreakpoint } from '@/hooks'
import { FlexProps, PaddingProps } from '@/types'
import type { ResponsiveProp } from '@/styles'

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
	const resolvedSpacing = useBreakpoint(spacing)
	const resolvedAlign = useBreakpoint(align)
	const resolvedJustify = useBreakpoint(justify)
	const resolvedDirection = useBreakpoint(direction)
	const resolvedWrap = useBreakpoint(wrap)
	const resolvedFlex = useBreakpoint(flex)

	const layoutStyle: ViewStyle = {
		flex: resolvedFlex ?? resolveResponsiveProp(flex),
		flexDirection: resolvedDirection ?? resolveResponsiveProp(direction),
		alignItems: resolvedAlign ?? resolveResponsiveProp(align),
		justifyContent: resolvedJustify ?? resolveResponsiveProp(justify),
		flexWrap: resolvedWrap ? 'wrap' : 'nowrap',

		gap: resolvedSpacing ?? resolveResponsiveProp(spacing) ?? 0,

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

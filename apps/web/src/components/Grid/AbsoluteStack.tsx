// apps/web/src/components/layout/AbsoluteStack.tsx

import React from 'react'
import type { ViewStyle, StyleProp } from 'react-native'
import type { PropsWithChildren } from 'react'
import FlexBox from './FlexBox'
import type { FlexBoxProps } from './FlexBox'

type PositionProps = {
	top?: number
	right?: number
	bottom?: number
	left?: number
}

type AbsoluteStackProps = PropsWithChildren<FlexBoxProps & PositionProps>

const AbsoluteStack: React.FC<AbsoluteStackProps> = ({
	top,
	right,
	bottom,
	left,
	style,
	...rest
}) => {
	const positionStyles: StyleProp<ViewStyle> = {
		position: 'absolute',
		top,
		right,
		bottom,
		left,
	}

	return <FlexBox {...rest} style={[positionStyles, style]} />
}

export default AbsoluteStack
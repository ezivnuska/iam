// packages/ui/src/components/Grid/AbsoluteStack.tsx

import React from 'react'
import type { ViewStyle, StyleProp } from 'react-native'
import type { PropsWithChildren } from 'react'
import { Stack } from '.'
import type { GridProps } from './Grid'

interface PositionProps {
	top?: number
	right?: number
	bottom?: number
	left?: number
}

type AbsoluteStackProps = PropsWithChildren<Omit<GridProps, 'direction'> & PositionProps>

export const AbsoluteStack: React.FC<AbsoluteStackProps> = ({
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

	return <Stack {...rest} style={[positionStyles, style]} />
}
// apps/web/src/components/layout/Column.tsx

import React, { ReactNode } from 'react'
import type { ViewStyle, StyleProp } from 'react-native'
import { FlexProps, PaddingProps, ResponsiveProp } from '@/types'
import FlexBox from './FlexBox'

export interface ColumnProps extends FlexProps, PaddingProps {
	children: ReactNode
	style?: StyleProp<ViewStyle>
    align?: ResponsiveProp<'flex-start' | 'flex-end' | 'center' | 'stretch'> // Make this match the type in FlexBox
}

const Column: React.FC<ColumnProps> = ({
	children,
	style,
	...flexProps
}) => {
	return (
		<FlexBox
			{...flexProps}
			direction='column'
			style={style}
		>
			{children}
		</FlexBox>
	)
}

export default Column
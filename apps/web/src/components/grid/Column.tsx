// apps/web/src/components/layout/Column.tsx

import React, { ReactNode } from 'react'
import type { ViewStyle, StyleProp } from 'react-native'
import { FlexProps, PaddingProps } from '@/types'
import type { ResponsiveProp } from '@iam/theme'
import FlexBox from './FlexBox'

export interface ColumnProps extends FlexProps, PaddingProps {
	children: ReactNode
	style?: StyleProp<ViewStyle>
	align?: ResponsiveProp<'flex-start' | 'flex-end' | 'center' | 'stretch'>
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

// packages/ui/src/components/Grid/Stack.tsx

import React from 'react'
import type { GridProps } from './Grid'
import Grid from './Grid'
import { ResponsiveProp } from '../../types/responsive'

export type StackProps = Omit<GridProps, 'direction'> & {
	direction?: ResponsiveProp<'column' | 'row' | 'row-reverse' | 'column-reverse'>
	align?: ResponsiveProp<'flex-start' | 'center' | 'flex-end' | 'stretch'>
	wrap?: ResponsiveProp<boolean>
}

export const Stack: React.FC<StackProps> = ({
	direction = 'column',
	align = 'center',
	wrap = true,
	...rest
}) => {
	return (
		<Grid 
			{...rest} 
			direction={direction} 
			align={align} 
			wrap={wrap} 
		/>
	)
}
// src/components/Stack.tsx

import React from 'react'
import type { GridProps } from './Grid.types'
import Grid from './Grid'
import { ResponsiveProp } from '../types/responsive'

export type StackProps = Omit<GridProps, 'direction'> & {
  direction?: ResponsiveProp<'column' | 'row' | 'row-reverse' | 'column-reverse' | undefined>
}

export const Stack: React.FC<GridProps> = (props: GridProps) => {
  return <Grid {...props} direction="column" align="center" wrap={true} />
}
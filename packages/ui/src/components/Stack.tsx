import React from 'react'
import { Grid } from './Grid'
import type { GridProps } from './Grid'

export type StackProps = Omit<GridProps, 'direction'>

export const Stack = (props: Omit<GridProps, 'direction'>) => {
  return <Grid direction="column" {...props} />
}
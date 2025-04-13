import React from 'react'
import { Grid } from './Grid'
import type { GridProps } from './Grid'

export const Row = (props: Omit<GridProps, 'direction'>) => {
  return <Grid direction="row" {...props} />
}
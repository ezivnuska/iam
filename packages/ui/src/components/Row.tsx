// src/components/Row.tsx

import React from 'react'
import type { GridProps } from './Grid.types'
import Grid from './Grid'

export const Row: React.FC<GridProps> = (props: GridProps) => {
  return <Grid {...props} direction="row" align="center" wrap={true} />
}
// packages/ui/src/components/Grid/Row.tsx

import React from 'react'
import type { GridProps } from './Grid'
import Grid from './Grid'

export const Row: React.FC<GridProps> = (props: GridProps) => {
    return <Grid {...props} direction="row" align="center" wrap={true} />
}
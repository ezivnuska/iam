// apps/web/src/components/Layout/types.ts

import { ReactNode } from 'react'
import { ViewStyle, StyleProp } from 'react-native'
import type { ResponsiveProp } from '@/types'

export interface PaddingProps {
    padding?: ResponsiveProp<number>
    paddingHorizontal?: ResponsiveProp<number>
    paddingVertical?: ResponsiveProp<number>
    paddingTop?: ResponsiveProp<number>
    paddingBottom?: ResponsiveProp<number>
    paddingLeft?: ResponsiveProp<number>
    paddingRight?: ResponsiveProp<number>
}

export interface PageLayoutProps extends PaddingProps {
    children: ReactNode
    style?: StyleProp<ViewStyle>
}
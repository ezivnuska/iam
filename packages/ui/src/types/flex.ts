// src/components/types/flex.ts

import type { ViewStyle } from 'react-native'
import type { ResponsiveProp } from './responsive'

export interface FlexProps {
  flex?: number
  spacing?: ResponsiveProp<number>
  align?: ResponsiveProp<ViewStyle['alignItems']>
  justify?: ResponsiveProp<ViewStyle['justifyContent']>
  direction?: ResponsiveProp<ViewStyle['flexDirection']>
  wrap?: ResponsiveProp<boolean>
}
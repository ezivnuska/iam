// types/layout.ts

import type { ViewStyle } from 'react-native'
import type { ResponsiveProp } from './responsive'

export interface FlexProps {
  flex?: ResponsiveProp<number>
  spacing?: ResponsiveProp<number>
  align?: ResponsiveProp<ViewStyle['alignItems']>
  justify?: ResponsiveProp<ViewStyle['justifyContent']>
  direction?: ResponsiveProp<ViewStyle['flexDirection']>
  wrap?: ResponsiveProp<boolean>
}

export interface PaddingProps {
  padding?: ResponsiveProp<number>
  paddingHorizontal?: ResponsiveProp<number>
  paddingVertical?: ResponsiveProp<number>
  paddingTop?: ResponsiveProp<number>
  paddingBottom?: ResponsiveProp<number>
  paddingLeft?: ResponsiveProp<number>
  paddingRight?: ResponsiveProp<number>
}
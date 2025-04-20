// types/layout.ts

import type { FlexAlignType, FlexStyle } from 'react-native'
import type { ResponsiveProp } from './responsive'

export interface FlexProps {
    flex?: ResponsiveProp<number>
    spacing?: ResponsiveProp<number>
    align?: ResponsiveProp<FlexAlignType>
    justify?: ResponsiveProp<FlexStyle['justifyContent']>
    direction?: ResponsiveProp<FlexStyle['flexDirection']>
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
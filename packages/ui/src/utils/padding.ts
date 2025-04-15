// packages/ui/src/utils/padding.ts

import { ResponsiveProp, resolveResponsiveProp } from './responsive'
import type { ViewStyle } from 'react-native'

type PaddingProps = {
  padding?: ResponsiveProp<number>
  paddingHorizontal?: ResponsiveProp<number>
  paddingVertical?: ResponsiveProp<number>
  paddingTop?: ResponsiveProp<number>
  paddingBottom?: ResponsiveProp<number>
  paddingLeft?: ResponsiveProp<number>
  paddingRight?: ResponsiveProp<number>
}

export function getResolvedPadding(props: PaddingProps): Partial<ViewStyle> {
  const style: Partial<ViewStyle> = {}

  if (props.padding !== undefined) style.padding = resolveResponsiveProp(props.padding)
  if (props.paddingHorizontal !== undefined)
    style.paddingHorizontal = resolveResponsiveProp(props.paddingHorizontal)
  if (props.paddingVertical !== undefined)
    style.paddingVertical = resolveResponsiveProp(props.paddingVertical)
  if (props.paddingTop !== undefined) style.paddingTop = resolveResponsiveProp(props.paddingTop)
  if (props.paddingBottom !== undefined) style.paddingBottom = resolveResponsiveProp(props.paddingBottom)
  if (props.paddingLeft !== undefined) style.paddingLeft = resolveResponsiveProp(props.paddingLeft)
  if (props.paddingRight !== undefined) style.paddingRight = resolveResponsiveProp(props.paddingRight)

  return style
}
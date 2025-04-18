import React from 'react'
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native'
import { resolveResponsiveProp } from '../utils/responsive'
import { getResolvedPadding } from '../utils/padding'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { FlexProps, PaddingProps } from '../types/layout'

export interface GridProps extends FlexProps, PaddingProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const Grid: React.FC<GridProps> = ({
  flex,
  spacing,
  align,
  justify,
  direction,
  wrap,
  children,

  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,

  style,
}) => {

  const resolvedSpacing = useBreakpoint(spacing) ?? 0
  const resolvedAlign = useBreakpoint(align)
  const resolvedJustify = useBreakpoint(justify)
  const resolvedDirection = useBreakpoint(direction)
  const resolvedWrap = useBreakpoint(wrap)

  const layoutStyle: ViewStyle = {
    flex: resolveResponsiveProp(flex),
    flexDirection: resolvedDirection,
    alignItems: resolvedAlign,
    justifyContent: resolvedJustify,
    flexWrap: resolvedWrap ? 'wrap' : 'nowrap',
    gap: resolvedSpacing,

    ...getResolvedPadding({
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    }),
  
  }

  return <View style={StyleSheet.flatten([layoutStyle, style])}>{children}</View>
}

export default Grid
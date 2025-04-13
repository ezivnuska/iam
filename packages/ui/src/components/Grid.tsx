import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { getFlexStyles } from '../utils/styles'

export type GridProps = {
  children: React.ReactNode

  flex?: number
  spacing?: number

  align?: ViewStyle['alignItems']
  justify?: ViewStyle['justifyContent']
  direction?: ViewStyle['flexDirection']
  wrap?: boolean

  padding?: number
  paddingHorizontal?: number
  paddingVertical?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number

  style?: StyleProp<ViewStyle>
}

export const Grid = ({
  children,
  flex,
  spacing,
  align,
  justify,
  direction = 'row',
  wrap = false,

  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,

  style,
}: GridProps) => {
  const layoutStyle: ViewStyle = {
    ...getFlexStyles({ spacing, align, justify, direction, wrap }),
    ...(flex !== undefined && { flex }),

    ...(padding !== undefined && { padding }),
    ...(paddingHorizontal !== undefined && { paddingHorizontal }),
    ...(paddingVertical !== undefined && { paddingVertical }),
    ...(paddingTop !== undefined && { paddingTop }),
    ...(paddingBottom !== undefined && { paddingBottom }),
    ...(paddingLeft !== undefined && { paddingLeft }),
    ...(paddingRight !== undefined && { paddingRight }),
  }

  return <View style={[layoutStyle, style]}>{children}</View>
}
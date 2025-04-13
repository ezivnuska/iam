import React from 'react'
import type { ViewStyle, StyleProp } from 'react-native'
import type { PropsWithChildren } from 'react'
import { Stack } from './Stack'
import type { GridProps } from './Grid'

interface PositionProps {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const AbsoluteStack = (
  props: PropsWithChildren<Omit<GridProps, 'direction'> & PositionProps>
) => {
  const positionStyles: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
  }

  return <Stack {...props} style={[positionStyles, props.style]} />
}
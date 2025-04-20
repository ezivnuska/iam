// packages/ui/src/components/Flex.tsx

import React from 'react'
import { View, ViewStyle } from 'react-native'
import type { FlexProps } from '../types/layout'
import { resolveResponsiveProp } from '../utils/responsive'

export const Flex: React.FC<React.PropsWithChildren<FlexProps>> = ({
  spacing,
  align,
  justify,
  direction,
  wrap,
  children,
}) => {
  const style: ViewStyle = {
    gap: resolveResponsiveProp(spacing),
    alignItems: resolveResponsiveProp(align),
    justifyContent: resolveResponsiveProp(justify),
    flexDirection: resolveResponsiveProp(direction),
    flexWrap: resolveResponsiveProp(wrap) ? 'wrap' : 'nowrap',
  }

  return <View style={style}>{children}</View>
}
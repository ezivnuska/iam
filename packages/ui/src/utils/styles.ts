import type { ViewStyle } from 'react-native'

type FlexStyleProps = {
  spacing?: number
  align?: ViewStyle['alignItems']
  justify?: ViewStyle['justifyContent']
  direction?: ViewStyle['flexDirection']
  wrap?: boolean
}

export const getFlexStyles = ({
  spacing = 0,
  align = 'stretch',
  justify = 'flex-start',
  direction = 'row',
  wrap = false,
}: FlexStyleProps): ViewStyle => ({
  flexDirection: direction,
  alignItems: align,
  justifyContent: justify,
  flexWrap: wrap ? 'wrap' : 'nowrap',
  // gap is not yet supported in RN, needs manual margin if needed
})
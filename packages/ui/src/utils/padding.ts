// packages/ui/src/utils/padding.ts

import { ResponsiveProp, resolveResponsiveProp } from './responsive'
import type { ViewStyle } from 'react-native'
import type { StackProps } from '../components/Grid'

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

export const mapPaddingToStyleObject = (
    padding: NonNullable<StackProps['padding']>
) => {
	if (!Array.isArray(padding)) {
		return {
			padding,
		}
	}

	if (padding.length === 1) {
		return {
			padding: padding[0],
		}
	}

	if (padding.length === 2) {
		return {
			paddingVertical: padding[0],
			paddingHorizontal: padding[1],
		}
	}

	if (padding.length === 4) {
		return {
			paddingTop: padding[0],
			paddingRight: padding[1],
			paddingBottom: padding[2],
			paddingLeft: padding[3],
		}
	}

	return {}
}
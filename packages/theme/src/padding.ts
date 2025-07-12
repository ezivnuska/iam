// packages/theme/src/padding.ts

import { ResponsiveProp, resolveResponsiveProp } from './breakpoints'
import type { ViewStyle } from 'react-native'
import { Size } from './spacing'

export type PaddingProps = {
	padding?: ResponsiveProp<Size | Size[]>
	paddingHorizontal?: ResponsiveProp<Size>
	paddingVertical?: ResponsiveProp<Size>
	paddingTop?: ResponsiveProp<Size>
	paddingBottom?: ResponsiveProp<Size>
	paddingLeft?: ResponsiveProp<Size>
	paddingRight?: ResponsiveProp<Size>
}

export function getResolvedPadding(props: PaddingProps): Partial<ViewStyle> {
	const style: Partial<ViewStyle> = {}

	const resolvedPadding = resolveResponsiveProp(props.padding)
	if (resolvedPadding !== undefined) {
		Object.assign(style, mapPaddingToStyleObject(resolvedPadding))
	}

	if (props.paddingHorizontal !== undefined)
		style.paddingHorizontal = resolveResponsiveProp(props.paddingHorizontal)
	if (props.paddingVertical !== undefined)
		style.paddingVertical = resolveResponsiveProp(props.paddingVertical)
	if (props.paddingTop !== undefined)
		style.paddingTop = resolveResponsiveProp(props.paddingTop)
	if (props.paddingBottom !== undefined)
		style.paddingBottom = resolveResponsiveProp(props.paddingBottom)
	if (props.paddingLeft !== undefined)
		style.paddingLeft = resolveResponsiveProp(props.paddingLeft)
	if (props.paddingRight !== undefined)
		style.paddingRight = resolveResponsiveProp(props.paddingRight)

	return style
}

function mapPaddingToStyleObject(padding: Size | Size[] | undefined): Partial<ViewStyle> {
	if (!padding) return {}

	if (!Array.isArray(padding)) return { padding }

	if (padding.length === 1) return { padding: padding[0] }
	if (padding.length === 2) return { paddingVertical: padding[0], paddingHorizontal: padding[1] }
	if (padding.length === 4) {
		const [pt, pr, pb, pl] = padding
		return { paddingTop: pt, paddingRight: pr, paddingBottom: pb, paddingLeft: pl }
	}

	return {}
}

export const paddingHorizontal = Size.S
export const paddingVertical = Size.S
// apps/web/src/styles/padding.ts

import { ResponsiveProp, resolveResponsiveProp } from './breakpoints'
import type { ViewStyle } from 'react-native'

type PaddingProps = {
	padding?: ResponsiveProp<number | number[]>
	paddingHorizontal?: ResponsiveProp<number>
	paddingVertical?: ResponsiveProp<number>
	paddingTop?: ResponsiveProp<number>
	paddingBottom?: ResponsiveProp<number>
	paddingLeft?: ResponsiveProp<number>
	paddingRight?: ResponsiveProp<number>
}

export function getResolvedPadding(props: PaddingProps): Partial<ViewStyle> {
	const style: Partial<ViewStyle> = {}

	if (props.padding !== undefined) {
		const value = resolveResponsiveProp(props.padding)
		Object.assign(style, mapPaddingToStyleObject(value))
	}
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

export function mapPaddingToStyleObject(padding: number | number[]) {
	if (!Array.isArray(padding)) return { padding }

	if (padding.length === 1) return { padding: padding[0] }
	if (padding.length === 2) return { paddingVertical: padding[0], paddingHorizontal: padding[1] }
	if (padding.length === 4) {
		const [pt, pr, pb, pl] = padding
		return { paddingTop: pt, paddingRight: pr, paddingBottom: pb, paddingLeft: pl }
	}

	return {}
}
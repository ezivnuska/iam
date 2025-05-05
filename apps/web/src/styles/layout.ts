// apps/web/src/styles/layout.ts

import type { ViewStyle } from 'react-native'

export type FlexStyleProps = {
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
})
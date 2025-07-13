// apps/web/src/types/layout.ts

import type {
	FlexAlignType,
	FlexStyle,
	StyleProp,
	ViewStyle,
} from 'react-native'
import type { ResponsiveProp } from '@iam/theme'
import type { ReactNode } from 'react'

export interface FlexProps {
	flex?: ResponsiveProp<number>
	spacing?: ResponsiveProp<number>
	align?: ResponsiveProp<FlexAlignType>
	justify?: ResponsiveProp<FlexStyle['justifyContent']>
	direction?: ResponsiveProp<FlexStyle['flexDirection']>
	wrap?: ResponsiveProp<boolean>
}

export interface PaddingProps {
	padding?: ResponsiveProp<number>
	paddingHorizontal?: ResponsiveProp<number>
	paddingVertical?: ResponsiveProp<number>
	paddingTop?: ResponsiveProp<number>
	paddingBottom?: ResponsiveProp<number>
	paddingLeft?: ResponsiveProp<number>
	paddingRight?: ResponsiveProp<number>
}

export interface MarginProps {
	margin?: ResponsiveProp<number>
	marginHorizontal?: ResponsiveProp<number>
	marginVertical?: ResponsiveProp<number>
	marginTop?: ResponsiveProp<number>
	marginBottom?: ResponsiveProp<number>
	marginLeft?: ResponsiveProp<number>
	marginRight?: ResponsiveProp<number>
}

export interface LayoutStyleProps
	extends FlexProps,
		PaddingProps,
		MarginProps {}

export interface PageLayoutProps extends PaddingProps {
	children: ReactNode
	style?: StyleProp<ViewStyle>
}

export interface ScreenLayoutProps extends PaddingProps {
    nav?: ReactNode,
	children: ReactNode
	style?: StyleProp<ViewStyle>
}

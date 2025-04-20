// packages/ui/src/components/PageHeader/PageHeader.types.ts

import { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface PageHeaderProps {
	title: string
	subtitle?: string
	style?: StyleProp<ViewStyle>
	titleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
}
// packages/ui/src/components/Button/Button.types.ts

import { GestureResponderEvent, StyleProp, ViewStyle, TextStyle } from 'react-native'

export interface ButtonProps {
	label: string
	onPress: (event: GestureResponderEvent) => void
	disabled?: boolean
	style?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
}
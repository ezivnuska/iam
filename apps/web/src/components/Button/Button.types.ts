// apps/web/src/components/Button/Button.types.ts

import { ReactNode } from 'react'
import { GestureResponderEvent, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { ResponsiveProp } from '@/types'

export interface ButtonProps {
	label: string
	onPress: () => void
	disabled?: boolean
	style?: StyleProp<ViewStyle>
	icon?: ReactNode
	active?: boolean
	showLabel?: ResponsiveProp<boolean>
}
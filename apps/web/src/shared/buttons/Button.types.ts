// apps/web/src/shared/buttons/Button.types.ts

import { ReactNode } from 'react'
import { StyleProp, ViewStyle, TextStyle } from 'react-native'
import type { ResponsiveProp } from '@iam/theme'

export interface ButtonProps {
	label?: string
	onPress: () => void
	disabled?: boolean
	style?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
	icon?: ReactNode
	active?: boolean
	showLabel?: ResponsiveProp<boolean>
	submitting?: boolean
    transparent?: boolean
}

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'muted'
    | 'tertiary'
    | 'transparent'
// apps/web/src/components/buttons/SubmitButton.tsx

import React from 'react'
import {
	ActivityIndicator,
	Text,
	StyleProp,
	ViewStyle,
	PressableStateCallbackType,
} from 'react-native'
import { Button, BaseButtonProps } from './Button'
import { baseButtonStyles } from '@/styles/buttonStyles'
import { useThemeColors } from '@/styles/theme'

type SubmitButtonProps = BaseButtonProps & {
	submitting?: boolean
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
	label,
	onPress,
	submitting = false,
	disabled = false,
	style,
	textStyle,
}) => {
	const theme = useThemeColors()

	const composedStyle =
		typeof style === 'function'
			? (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
					const base = style(state)
					return [base]
			  }
			: style

	return (
		<Button
			onPress={onPress}
			disabled={disabled || submitting}
			style={composedStyle}
			textStyle={textStyle}
			variant="success"
		>
			{submitting ? (
				<ActivityIndicator color={theme.text} size="small" />
			) : (
				<Text style={[baseButtonStyles.text, { color: theme.text }, textStyle]}>
					{label}
				</Text>
			)}
		</Button>
	)
}

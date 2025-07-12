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
import { baseButtonStyles } from '@iam/theme'
import { useTheme } from '@/hooks'

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
	const { theme } = useTheme()

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
			variant='success'
		>
			{submitting ? (
				<ActivityIndicator color={theme.colors.primary} size='small' />
			) : (
				<Text style={[baseButtonStyles.text, { color: theme.colors.primary }, textStyle]}>
					{label}
				</Text>
			)}
		</Button>
	)
}

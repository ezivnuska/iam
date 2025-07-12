// apps/web/src/components/buttons/Button.tsx

import React from 'react'
import {
	Pressable,
	Text,
	StyleProp,
	TextStyle,
	ViewStyle,
	PressableStateCallbackType,
} from 'react-native'
import { baseButtonStyles, type Theme } from '@iam/theme'
import { useTheme } from '@/hooks'

export type BaseButtonProps = {
	label?: string
	onPress: () => void
	disabled?: boolean
	style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
	textStyle?: StyleProp<TextStyle>
	children?: React.ReactNode
	variant?: keyof Theme['colors'] | 'transparent'
	animateOnPress?: boolean
}

export const Button: React.FC<BaseButtonProps> = ({
	label,
	onPress,
	disabled = false,
	style,
	textStyle,
	children,
	variant = 'primary',
	animateOnPress = true,
}) => {
	const { theme } = useTheme()

	const backgroundColor =
		variant === 'transparent'
			? 'transparent'
			: theme.colors[variant as keyof typeof theme.colors] ?? theme.colors.primary

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => {
				const customStyle =
					typeof style === 'function' ? style({ pressed }) : style

				return [
					baseButtonStyles.base,
					{ backgroundColor },
					disabled && baseButtonStyles.disabled,
					pressed && baseButtonStyles.pressed,
					customStyle,
				]
			}}
		>
			{children ?? (
				<Text
					style={[
						baseButtonStyles.text,
						{ color: theme.colors.text },
						textStyle,
					]}
				>
					{label}
				</Text>
			)}
		</Pressable>
	)
}

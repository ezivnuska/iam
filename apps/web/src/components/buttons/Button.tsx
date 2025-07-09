// apps/web/src/components/buttons/Button.tsx

import React from 'react'
import {
	Pressable,
	Text,
	StyleProp,
	TextStyle,
	ViewStyle,
	PressableStateCallbackType,
	Platform,
	Animated,
} from 'react-native'
import { baseButtonStyles } from '@/styles/buttonStyles'
import { useThemeColors } from '@/styles/theme'

export type BaseButtonProps = {
	label?: string
	onPress: () => void
	disabled?: boolean
	style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
	textStyle?: StyleProp<TextStyle>
	children?: React.ReactNode
	variant?: 'primary' | 'success' | 'danger' | 'transparent'
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
	const theme = useThemeColors()

	const backgroundColor =
		variant === 'transparent'
			? 'transparent'
			: theme[variant] || theme.primary

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
						{ color: theme.text },
						textStyle,
					]}
				>
					{label}
				</Text>
			)}
		</Pressable>
	)
}

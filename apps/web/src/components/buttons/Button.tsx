// apps/web/src/components/buttons/Button.tsx

import React, { useMemo } from 'react'
import {
    ActivityIndicator,
	Pressable,
	Text,
	StyleProp,
	ViewStyle,
	PressableStateCallbackType,
} from 'react-native'
import { Row } from '@/components'
import { getBaseButtonStyles, getButtonVariantStyles, type Theme } from '@iam/theme'
import { useTheme } from '@/hooks'

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

export type BaseButtonProps = {
    label?: string
    onPress: () => void
    disabled?: boolean
    style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    variant?: ButtonVariant
    showActivity?: boolean
}

export const Button: React.FC<BaseButtonProps> = ({
	label,
	onPress,
	disabled = false,
	style,
	variant = 'primary',
    showActivity = false,
}) => {
	const { theme } = useTheme()
    const baseButtonStyles = getBaseButtonStyles(theme)
    const buttonVariants = getButtonVariantStyles(theme)
    const variantStyles = buttonVariants[variant] ?? buttonVariants.primary
    useMemo(() => console.log('showActivity', showActivity), [showActivity])
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled || showActivity}
			style={({ pressed }) => {
                const customStyle =
                    typeof style === 'function' ? style({ pressed }) : style
            
                return [
                    baseButtonStyles.base,
                    { backgroundColor: variantStyles.backgroundColor },
                    disabled && baseButtonStyles.disabled,
                    pressed && baseButtonStyles.pressed,
                    customStyle,
                    variant === 'transparent' && { height: 'auto', padding: 0 },
                ]
            }}            
		>
            <Row>
                {showActivity ? <ActivityIndicator color={variantStyles.textColor} size='small' />
                : (
                    <Text
                        style={[
                            baseButtonStyles.text,
                            { color: variantStyles.textColor },
                        ]}
                    >            
                        {label}
                    </Text>
                )}
            </Row>
		</Pressable>
	)
}

// apps/web/src/shared/buttons/Button.tsx

import React from 'react'
import {
    ActivityIndicator,
	Pressable,
	Text,
	StyleProp,
	ViewStyle,
	PressableStateCallbackType,
} from 'react-native'
import { Row } from '@shared/grid'
import { useButtonStyles, useTheme } from '@shared/hooks'
import { resolveResponsiveProp } from '@iam/theme'

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
    const { baseButtonStyles, buttonVariants } = useButtonStyles()
    const variantStyles = buttonVariants[variant] ?? buttonVariants.primary
    const fontSize = resolveResponsiveProp({ xs: 14, sm: 16, md: 18, lg: 20 })
    
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
                    variant === 'transparent' && {
                        borderColor: theme.colors.muted,
                        borderWidth: 1,
                    },
                ]
            }}            
		>
            <Row>
                {showActivity ? <ActivityIndicator color={variantStyles.textColor} size='small' />
                : (
                    <Text
                        style={[
                            baseButtonStyles.text,
                            { fontSize, color: variantStyles.textColor },
                        ]}
                    >            
                        {label}
                    </Text>
                )}
            </Row>
		</Pressable>
	)
}

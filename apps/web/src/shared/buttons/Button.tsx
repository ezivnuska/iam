// apps/web/src/shared/buttons/ButtonWithIcon.tsx

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
import Ionicons from '@expo/vector-icons/Ionicons'
import type { ButtonVariant } from './Button.types'

export type ButtonProps = {
    label?: string
    iconName?: string
    onPress: () => void
    disabled?: boolean
    style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    variant?: ButtonVariant
    showActivity?: boolean
    compact?: boolean
}

export const Button: React.FC<ButtonProps> = ({
	label,
    iconName,
	onPress,
	disabled = false,
	style,
	variant = 'primary',
    showActivity = false,
    compact = false,
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
                    compact && {
                        height: 30,
                    },
                ]
            }}            
		>
            <Row spacing={6} align='center'>
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
                <Ionicons name={iconName as any} size={24} color={variantStyles.textColor} />
            </Row>
		</Pressable>
	)
}

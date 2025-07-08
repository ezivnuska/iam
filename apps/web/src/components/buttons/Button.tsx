// apps/web/src/components/Button/Button.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import type { ButtonProps } from './Button.types'

export const Button: React.FC<ButtonProps> = ({
	label,
	onPress,
	disabled = false,
	style,
	textStyle,
    transparent = false,
}) => {
	return (
		<Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.base,
                disabled && styles.disabled,
                pressed && styles.pressed,
                style,
                { backgroundColor: transparent ? 'transparent' : '#333' },
            ]}
		>
            <Text style={[styles.text, textStyle]}>{label}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	base: {
        flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		alignItems: 'center',
	},
	text: {
		color: '#fff',
		fontWeight: '600',
	},
	disabled: {
		backgroundColor: '#999',
	},
	pressed: {
		opacity: 0.85,
	},
})
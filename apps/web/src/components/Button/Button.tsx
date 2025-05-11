// packages/ui/src/components/Button/Button.tsx

import React from 'react'
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native'
import type { ButtonProps } from './Button.types'

export const Button: React.FC<ButtonProps> = ({
	label,
	onPress,
	disabled = false,
	style,
	textStyle,
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
            ]}
		>
            <Text style={[styles.text, textStyle]}>{label}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	base: {
        // width: '100%',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#333',
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
// apps/web/src/forms/shared/SubmitButton.tsx

import React from 'react'
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native'
import type { ButtonProps } from '@/components'

export const SubmitButton: React.FC<ButtonProps> = ({
	label,
	onPress,
    submitting = false,
	disabled = false,
	style,
	textStyle,
}) => {
	return (
		<Pressable
            onPress={onPress}
            disabled={disabled || submitting}
            style={({ pressed }) => [
                styles.base,
                disabled && styles.disabled,
                pressed && styles.pressed,
                style,
            ]}
		>
            {submitting ? (
                <ActivityIndicator color='#fff' size='small' />
            ) : (
                <Text style={[styles.text, textStyle]}>{label}</Text>
            )}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	base: {
        flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#070',
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
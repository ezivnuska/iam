// apps/web/src/components/buttons/IconButton.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { Column } from '@/components'
import type { ButtonProps } from './Button.types'
import { resolveResponsiveProp } from '@iam/theme'

export const IconButton: React.FC<ButtonProps> = ({
	label,
	onPress,
	disabled = false,
	style,
	active = false,
	icon,
	showLabel = true,
}) => {
	const shouldShowLabel = resolveResponsiveProp(showLabel)

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [
				styles.button,
				disabled && styles.disabled,
				pressed && styles.pressed,
				active && styles.activeButton,
			]}
		>
			<Column spacing={4} align='center'>
				{icon}
				{label && shouldShowLabel && (
					<Text
						style={[
							styles.buttonLabel,
							active && styles.activeButtonLabel,
						]}
					>
						{label}
					</Text>
				)}
			</Column>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	content: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		marginBottom: 0,
	},	
	text: {
		color: '#ccc',
		fontWeight: '600',
	},
	disabled: {
		// backgroundColor: 'rgba(255, 255, 255, 0.25)',
	},
	pressed: {
		opacity: 0.85,
	},
    button: {
        // paddingVertical: 4,
        // paddingHorizontal: 12,
    },
    activeButton: {
		// backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    buttonLabel: {
        fontSize: 14,
        color: '#ccc',
        lineHeight: 12,
    },
    activeButtonLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
})
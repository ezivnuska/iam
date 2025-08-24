// apps/web/src/shared/buttons/IconButton.tsx

import React, { type ComponentProps } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { Column } from '@shared/grid'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTheme } from '@shared/hooks'
import { Size } from '@iam/theme'

type IoniconsName = ComponentProps<typeof Ionicons>['name']

export interface IconButtonProps {
	label?: string
	onPress: () => void
	disabled?: boolean
	active?: boolean
	showLabel?: boolean
	iconName: IoniconsName
	iconSize?: number
}

export const IconButton: React.FC<IconButtonProps> = ({
	label,
	onPress,
	disabled = false,
	active = false,
	showLabel = true,
	iconName,
	iconSize = 20,
}) => {
	const { theme } = useTheme()

	const iconColor = active ? theme.colors.text : theme.colors.primary//active ? theme.colors.primary : theme.colors.muted
	const labelColor = active ? theme.colors.text : theme.colors.primary//active ? theme.colors.primary : theme.colors.muted
	const backgroundColor = active ? theme.colors.primary : 'transparent'//active ? theme.colors.primary : theme.colors.muted

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
				active && { backgroundColor, borderRadius: 6 },
			]}
		>
			<Column spacing={4} align='center'>
				<Ionicons name={iconName as any} size={iconSize} color={iconColor} />
				{label && showLabel && (
					<Text style={[styles.label, { color: labelColor, fontWeight: active ? 'bold' : 'normal' }]}>
						{label}
					</Text>
				)}
			</Column>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
        paddingBottom: Size.XS
		// paddingHorizontal: 8,
		// paddingVertical: 4,
	},
	pressed: {
		opacity: 0.85,
	},
	label: {
		fontSize: 14,
		lineHeight: 16,
	},
})

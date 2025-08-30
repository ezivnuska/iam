// apps/web/src/shared/buttons/IconButton.tsx

import React, { type ComponentProps } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { Column } from '@shared/grid'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTheme } from '@shared/hooks'

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

	const iconColor = active ? theme.colors.text : theme.colors.primary
	const labelColor = active ? theme.colors.text : theme.colors.primary
	const backgroundColor = active ? theme.colors.primary : 'transparent'

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [
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
	pressed: {
		opacity: 0.85,
	},
	label: {
		fontSize: 14,
		lineHeight: 16,
	},
})

// apps/web/src/styles/buttonStyles.ts

import { StyleSheet, Platform } from 'react-native'

export const baseButtonStyles = StyleSheet.create({
	base: {
		width: '100%',
		minHeight: 48,
		paddingVertical: Platform.OS === 'web' ? 14 : 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
		fontSize: 16,
	},
	disabled: {
		opacity: 0.5,
	},
	pressed: {
		opacity: 0.85,
	},
})

export const buttonVariants = StyleSheet.create({
	primary: {
		backgroundColor: '#333',
	},
	success: {
		backgroundColor: '#070',
	},
	transparent: {
		backgroundColor: 'transparent',
	},
})

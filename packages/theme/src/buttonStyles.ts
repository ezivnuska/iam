// packages/theme/src/buttonStyles.ts

import { StyleSheet, Platform } from 'react-native'
import type { Theme } from './themes'

export const getBaseButtonStyles = (theme: Theme) =>
	StyleSheet.create({
		base: {
            paddingVertical: 4,
			paddingHorizontal: 8,
			borderRadius: 6,
			alignItems: 'center',
			justifyContent: 'center',
		},
		text: {
			fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
			fontSize: 14,
			color: theme.colors.text,
		},
		disabled: {
			opacity: 0.5,
		},
		pressed: {
			opacity: 0.85,
		},
	})

export const getButtonVariantStyles = (theme: Theme) => ({
	primary: {
		backgroundColor: theme.colors.primary,
		textColor: theme.colors.tertiary,
	},
	secondary: {
		backgroundColor: theme.colors.secondary,
		textColor: theme.colors.background,
	},
	success: {
		backgroundColor: theme.colors.success,
		textColor: 'white',//theme.colors.text,
	},
	danger: {
		backgroundColor: theme.colors.error,
		textColor: theme.colors.background,
	},
	warning: {
		backgroundColor: theme.colors.warning ?? '#FBBF24',
		textColor: theme.colors.background,
	},
	info: {
		backgroundColor: theme.colors.info ?? '#3B82F6',
		textColor: theme.colors.background,
	},
	muted: {
		backgroundColor: theme.colors.muted,
		textColor: theme.colors.background,
	},
	tertiary: {
		backgroundColor: theme.colors.tertiary ?? theme.colors.muted,
		textColor: theme.colors.text,
	},
	transparent: {
		backgroundColor: 'transparent',
		textColor: theme.colors.text,
	},
})

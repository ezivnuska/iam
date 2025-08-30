// packages/theme/src/buttonStyles.ts

import { StyleSheet, Platform } from 'react-native'
import type { Theme } from './themes'

export const getBaseButtonStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
            height: 48,
			paddingHorizontal: 12,
			borderRadius: 24,
			alignItems: 'center',
			justifyContent: 'center',
		},
        compactContainer: {
            height: 30,
        },
        transparentContainer: {
            height: 30,
        },
		text: {
			fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
			fontSize: 20,
			color: theme.colors.text,
		},
		compactText: {
			fontSize: 16,
		},
		disabled: {
			opacity: 0.5,
		},
		pressed: {
			opacity: 0.85,
            borderColor: theme.colors.muted,
            borderWidth: 1,
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

// packages/theme/src/form.ts

import { TextStyle, ViewStyle } from 'react-native'
import { lightColors as c } from './colors' // Replace with dynamic theme selector if needed

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle }

export const form: NamedStyles<any> = {
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 24,
		color: c.text,
	} as TextStyle,

	label: {
		fontSize: 16,
		lineHeight: 20,
		fontWeight: '600',
		marginBottom: 8,
		color: c.textSecondary,
	} as TextStyle,

	input: {
		flex: 1,
		paddingHorizontal: 12,
		lineHeight: 48,
		borderRadius: 12,
		fontSize: 18,
		backgroundColor: c.formField.background,
		color: c.formField.text,
		borderWidth: 1,
		borderColor: c.formField.border,
		outlineWidth: 0,
		outlineColor: 'transparent',
	} as TextStyle,

	inputFocused: {
		borderColor: c.formField.borderFocused,
	} as TextStyle,

	textArea: {
		lineHeight: 36,
		minHeight: 200,
		paddingVertical: 8,
	} as TextStyle,

	error: {
		color: c.error,
		fontSize: 12,
		lineHeight: 24,
		textAlign: 'right',
	} as TextStyle,
}

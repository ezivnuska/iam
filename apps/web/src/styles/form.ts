// apps/web/src/styles/form.ts

import { TextStyle, ViewStyle } from 'react-native'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle }

export const form: NamedStyles<any> = {
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 24,
        color: '#fff',
	} as TextStyle,

	label: {
        fontSize: 16,
		lineHeight: 24,
		fontWeight: '600',
		marginBottom: 8,
        color: '#fff',
	} as TextStyle,

	input: {
        flex: 1,
		paddingHorizontal: 12,
        lineHeight: 48,
		borderRadius: 12,
		fontSize: 24,
        backgroundColor: '#222',
        color: '#fff',
        // outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
	} as TextStyle,

	textArea: {
        lineHeight: 36,
		minHeight: 200,
        paddingVertical: 8,
	} as TextStyle,

	inputFocused: {
		backgroundColor: '#033',
	} as TextStyle,

	error: {
		color: 'red',
        lineHeight: 24,
        textAlign: 'right',
	} as TextStyle,
}

// apps/web/src/styles/form.ts

import { TextStyle, ViewStyle } from 'react-native'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle }

export const form: NamedStyles<any> = {
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 24,
	} as TextStyle,

	input: {
		width: '100%',
		padding: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		fontSize: 24,
	} as TextStyle,

	textArea: {
		minHeight: 200,
	} as TextStyle,

	inputFocused: {
		borderWidth: 1,
		backgroundColor: '#ccffcc',
		borderColor: 'green',
	} as TextStyle,

	error: {
		color: 'red',
		marginBottom: 8,
	} as TextStyle,
}

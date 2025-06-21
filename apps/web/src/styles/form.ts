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

	input: {
		// width: '100%',
        flex: 1,
		// padding: 12,
		paddingHorizontal: 12,
        lineHeight: 48,
		// marginBottom: 12,
		// borderWidth: 1,
		// borderColor: '#ccc',
		borderRadius: 12,
		fontSize: 24,
        backgroundColor: '#222',
        color: '#fff',
        // outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
	} as TextStyle,

	textArea: {
		minHeight: 200,
	} as TextStyle,

	inputFocused: {
		// borderWidth: 1,
		backgroundColor: '#033',
		// borderColor: 'green',
	} as TextStyle,

	error: {
		color: 'red',
		marginBottom: 8,
	} as TextStyle,
}

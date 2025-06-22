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
		// padding: 12,
		// marginBottom: 12,
		// borderWidth: 1,
		// borderColor: '#ccc',
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
		// borderWidth: 1,
		backgroundColor: '#033',
		// borderColor: 'green',
	} as TextStyle,

	error: {
		color: 'red',
		marginTop: 8,
        // lineHeight: 20,
        // backgroundColor: 'yellow',
	} as TextStyle,
}

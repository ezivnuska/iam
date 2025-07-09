// apps/web/src/styles/theme.ts

import { ColorSchemeName, Platform } from 'react-native'
import { useColorScheme } from 'react-native'

export const useThemeColors = () => {
	const scheme: ColorSchemeName = useColorScheme()

	return scheme === 'dark' ? darkTheme : lightTheme
}

const baseColors = {
	white: '#fff',
	black: '#000',
	gray: '#999',
}

export const lightTheme = {
	...baseColors,
	primary: '#333',
	success: '#070',
	danger: '#c00',
	text: baseColors.white,
	background: baseColors.white,
}

export const darkTheme = {
	...baseColors,
	primary: '#ccc',
	success: '#0f0',
	danger: '#f55',
	text: baseColors.gray,
	background: '#111',
}

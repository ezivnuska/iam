// packages/theme/src/themes.ts

import { lightColors, darkColors } from './colors'
import { spacing } from './spacing'
import { typography } from './typography'

export const lightTheme = {
	colors: lightColors,
	spacing,
	typography,
}

export const darkTheme = {
	colors: darkColors,
	spacing,
	typography,
}

export type Theme = typeof lightTheme

// apps/web/src/hooks/useTheme.ts

import { useContext } from 'react'
import { ThemeContext, ThemeContextType } from '@/providers'

export const useThemeContext = (): ThemeContextType => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeProvider')
	}
	return context
}

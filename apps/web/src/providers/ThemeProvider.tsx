// apps/web/src/providers/ThemeProvider.tsx

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightTheme, darkTheme, Theme } from '@iam/theme'

export type ThemeContextType = {
	theme: Theme
	toggleTheme: () => void
	isDark: boolean
}

const STORAGE_KEY = 'user-theme-preference'

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [isDark, setIsDark] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadTheme = async () => {
			try {
				const storedValue = await AsyncStorage.getItem(STORAGE_KEY)
				if (storedValue !== null) {
					setIsDark(storedValue === 'dark')
				} else {
					// fallback to system preference
					const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
					setIsDark(prefersDark)
				}
			} catch (err) {
				console.error('Failed to load theme:', err)
			} finally {
                setIsLoading(false)
            }
		}
		loadTheme()
	}, [])

	const toggleTheme = async () => {
		try {
			const newValue = !isDark
			setIsDark(newValue)
			await AsyncStorage.setItem(STORAGE_KEY, newValue ? 'dark' : 'light')
		} catch (err) {
			console.error('Failed to save theme:', err)
		}
	}

	const theme = isDark ? darkTheme : lightTheme
    
	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
			{!isLoading && children}
		</ThemeContext.Provider>
	)
}

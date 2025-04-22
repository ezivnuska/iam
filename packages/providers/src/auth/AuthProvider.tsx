// apps/web/src/contexts/AuthProvider.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react'
import axios from 'axios'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'

interface AuthContextType {
	user: any
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any>(null)
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const login = async (email: string, password: string) => {
		try {
			const res = await axios.post('https://your-backend.com/api/auth/login', { email, password }, {
				withCredentials: true, // If you're using cookies
			})
			// Set user data and navigate
			setUser(res.data.user)
			navigation.navigate('Home')
		} catch (err) {
			console.error('Login failed:', err)
		}
	}

	const logout = async () => {
		try {
			await axios.post('https://your-backend.com/api/auth/logout', {}, { withCredentials: true })
			setUser(null)
			navigation.navigate('Signin')
		} catch (err) {
			console.error('Logout failed:', err)
		}
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

// Custom hook to use the auth context
// export const useAuth = () => {
// 	const context = useContext(AuthContext)
// 	if (!context) {
// 		throw new Error('useAuth must be used within an AuthProvider')
// 	}
// 	return context
// }
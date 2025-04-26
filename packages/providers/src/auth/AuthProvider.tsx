// packages/providers/src/auth/AuthProvider.tsx

import React, { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { getToken, saveToken, clearToken, api, getProfile, signinRequest, logoutRequest, setAuthHeader, clearAuthHeader } from '@services'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList, User } from '@iam/types'

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [authReady, setAuthReady] = useState(false)
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const initialize = useCallback(async () => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No token found')

			setAuthHeader(token)

			const profile = await getProfile()
			setUser(profile)
			setIsAuthenticated(true)
			navigation.navigate('Home')
		} catch (error: unknown) {
			console.error('Auth initialization failed:', error)
			await logoutRequest()
			await clearToken()
			setUser(null)
			setIsAuthenticated(false)
			navigation.navigate('Signin')
		} finally {
			setAuthReady(true)
		}
	}, [])

	useEffect(() => {
		if (user) navigation.navigate('Home')
	}, [user])

	const login = useCallback(async (email: string, password: string) => {
		try {
			const { accessToken, user } = await signinRequest(email, password)
			await saveToken(accessToken)
			setAuthHeader(accessToken)

			setUser(user)
			setIsAuthenticated(true)
		} catch (error: unknown) {
			console.error('Login failed:', error)
			throw error
		}
	}, [navigation])

	const logout = useCallback(async () => {
		try {
			await logoutRequest()
			await clearToken()
		} catch (error) {
			console.error('Logout failed:', error)
		} finally {
			clearAuthHeader()
			setUser(null)
			setIsAuthenticated(false)
			navigation.navigate('Signin')
		}
	}, [navigation])

	useEffect(() => {
		initialize()
	}, [initialize])

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, authReady, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
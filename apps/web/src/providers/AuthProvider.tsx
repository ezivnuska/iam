// apps/web/src/providers/AuthProvider.tsx

import React, { useEffect, useState, useContext } from 'react'
import {
	saveToken,
	clearToken,
	signinRequest,
	logoutRequest,
	setAuthHeader,
	clearAuthHeader,
	getProfile,
	trySigninFromStoredToken,
	setUnauthorizedHandler,
} from '@services'
import { navigate, navigationRef } from '../navigation'
import { createContext } from 'react'
import type { User } from '@iam/types'
import { useSocket } from '@/hooks'

export type AuthContextType = {
	isAuthenticated: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	user: null,
	login: async () => {},
	logout: async () => {},
	setUser: () => {},
})

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const { connectSocket, disconnectSocket } = useSocket()

	const login = async (email: string, password: string) => {
		console.log('🔐 login called')
		const { accessToken, user: userProfile } = await signinRequest(email, password)
		await saveToken(accessToken)
		setAuthHeader(accessToken)
		setUser(userProfile)
		setIsAuthenticated(true)

		connectSocket(accessToken)

		navigate('Home')
	}

	const logout = async () => {
		await logoutRequest()
		await clearToken()
		clearAuthHeader()
		setIsAuthenticated(false)
		setUser(null)

		disconnectSocket()

		navigate('Home')
	}

	useEffect(() => {
		setUnauthorizedHandler(() => navigationRef.navigate('Signin'))

		const initialize = async () => {
			const profile = await trySigninFromStoredToken()
		
			if (profile) {
				const token = localStorage.getItem('accessToken')
		
				if (token) {
					try {
						connectSocket(token)
					} catch (err) {
						console.error('❌ Socket failed to connect with stored token:', err)
						disconnectSocket()
					}
				}
		
				setUser(profile)
				setIsAuthenticated(true)
			} else {
				navigate('Home')
			}
		}		

		initialize()

		return () => {
			setUnauthorizedHandler(() => {})
		}
	}, [])

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	)
}

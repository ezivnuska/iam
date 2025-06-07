import React, { useEffect, useState, useCallback, createContext } from 'react'
import {
	saveToken,
	clearToken,
	signinRequest,
	logoutRequest,
	setAuthHeader,
	clearAuthHeader,
	trySigninFromStoredToken,
	setUnauthorizedHandler,
} from '@services'
import { getProfile } from '@services'
import { navigate } from '../navigation'
import { useModal } from '@/hooks'
import { SigninForm } from '@/components'
import type { User } from '@iam/types'

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

	const { showModal } = useModal()

	const login = async (email: string, password: string) => {
		const { accessToken, user: userProfile } = await signinRequest(email, password)
		await saveToken(accessToken)
		setAuthHeader(accessToken)
		setUser(userProfile)
		setIsAuthenticated(true)
		navigate('Home')
	}

	const logout = useCallback(async () => {
		await logoutRequest()
		await clearToken()
		clearAuthHeader()
		setIsAuthenticated(false)
		setUser(null)
		navigate('Home')
	}, [])

	useEffect(() => {
		const initialize = async () => {
			const profile = await trySigninFromStoredToken()
			if (profile) {
				setUser(profile)
				setIsAuthenticated(true)
			} else {
				navigate('Home')
			}
		}

		initialize()

		setUnauthorizedHandler(() => {
			logout()
			showModal(<SigninForm />)
		})
	}, [logout])

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	)
}

// apps/web/src/providers/AuthProvider.tsx

import React, { useEffect, useState, createContext } from 'react'
import {
	getToken,
	saveToken,
	clearToken,
	signinRequest,
	signupRequest,
	logoutRequest,
	setAuthHeader,
	clearAuthHeader,
	trySigninFromStoredToken,
} from '@services'
import { SocketProvider } from '@/providers'
import { navigate } from '../navigation'
import type { User } from '@iam/types'
import { LoadingScreen } from '@/screens'

export type AuthContextType = {
	isAuthenticated: boolean
	isAuthInitialized: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	setUser: (user: User | null) => void
    signup: (email: string, username: string, password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isAuthInitialized: false,
	user: null,
	login: async () => {},
	logout: async () => {},
	setUser: () => {},
	signup: async () => {},
})

type AuthProviderProps = {
	children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isAuthInitialized, setIsAuthInitialized] = useState(false)
	const [token, setToken] = useState<string | null>(null)

	const login = async (email: string, password: string) => {
		const { accessToken, user: userProfile } = await signinRequest(email, password)
		await saveToken(accessToken)
		setAuthHeader(accessToken)
		setToken(accessToken)
		setUser(userProfile)
		setIsAuthenticated(true)
	}

    const signup = async (email: string, username: string, password: string) => {
        const { accessToken, user: userProfile } = await signupRequest(email, username, password)
        await saveToken(accessToken)
        setAuthHeader(accessToken)
        setToken(accessToken)
        setUser(userProfile)
        setIsAuthenticated(true)
    }    

	const logout = async () => {
		await logoutRequest()
		await clearToken()
		clearAuthHeader()
		setToken(null)
		setIsAuthenticated(false)
		setUser(null)
		navigate('Home')
	}

	useEffect(() => {
		const initialize = async () => {
			const profile = await trySigninFromStoredToken()
			if (profile) {
				const token = await getToken()
				if (token) {
					setAuthHeader(token)
					setToken(token)
				}
				setUser(profile)
				setIsAuthenticated(true)
			} else {
				navigate('Home')
			}
			setIsAuthInitialized(true)
		}

		initialize()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isAuthInitialized,
				user,
				login,
				logout,
				setUser,
				signup,
			}}
		>
            {isAuthInitialized
                ? (
                    <SocketProvider token={token}>
                        {children}
                    </SocketProvider>
                )
                : <LoadingScreen label="Authenticating..." />
            }
		</AuthContext.Provider>
	)
}

// apps/web/src/shared/providers/AuthProvider.tsx

import React, { useEffect, useState, createContext } from 'react'
import {
	clearToken,
	logoutRequest,
	setAuthHeader,
	clearAuthHeader,
	trySigninFromStoredToken,
} from '@iam/services'
import { navigate } from '@shared/navigation'
import type { AuthResponseType, User } from '@iam/types'
import { useSocket } from '@shared/hooks'

export type AuthContextType = {
	isAuthenticated: boolean
	isAuthInitialized: boolean
	user: User | null
    loading: boolean
	logout: () => Promise<void>
	setUser: (user: User | null) => void
    authenticate: (response: AuthResponseType) => void
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isAuthInitialized: false,
	user: null,
    loading: false,
	logout: async () => {},
	setUser: () => {},
	authenticate: () => {},
})

type AuthProviderProps = {
	children: React.ReactNode
}

export const AuthProvider = ({
	children,
}: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isAuthInitialized, setIsAuthInitialized] = useState(false)
    
    const { connectSocket, disconnectSocket } = useSocket()

    const loading = !isAuthInitialized

	useEffect(() => {
		const initialize = async () => {
			try {
				const authResponse = await trySigninFromStoredToken()
				if (authResponse) {
					await authenticate(authResponse)
				} else {
					navigate('Home')
				}
			} catch (err) {
				console.log('Error initializing')
			} finally {
				setIsAuthInitialized(true)
			}
		}

		initialize()
	}, [])

	const authenticate = async (data: AuthResponseType) => {
		const { accessToken, user: userProfile } = data
		setAuthHeader(accessToken)
		setUser(userProfile)
		setIsAuthenticated(true)
		connectSocket(accessToken)
	}

	const logout = async () => {
		await logoutRequest()
		await clearToken()
		disconnectSocket()
		clearAuthHeader()
		setUser(null)
		setIsAuthenticated(false)
		navigate('Home')
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isAuthInitialized,
				user,
                loading,
				authenticate,
				logout,
				setUser,
			}}
		>
            {children}
		</AuthContext.Provider>
	)
}

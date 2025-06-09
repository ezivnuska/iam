import React, { useEffect, useState } from 'react'
import { saveToken, clearToken, signinRequest, logoutRequest, setAuthHeader, clearAuthHeader, getProfile } from '@services'
import { trySigninFromStoredToken, setUnauthorizedHandler } from '@services'
import { navigate, navigationRef } from '../navigation'
import { createContext } from 'react'
import type { User } from '@iam/types'

// setUnauthorizedHandler(() => {
// 	window.location.href = '/'
// })

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
    setUser: async () => {},
})

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
  
	const login = async (email: string, password: string) => {
        const { accessToken, user: userProfile } = await signinRequest(email, password)
        await saveToken(accessToken)
        setAuthHeader(accessToken)
        setUser(userProfile)
        setIsAuthenticated(true)
        navigate('Home')
    }
  
	const logout = async () => {
        await logoutRequest()
        await clearToken()
        clearAuthHeader()
        setIsAuthenticated(false)
        setUser(null)
        navigate('Home')
    }

    useEffect(() => {
        setUnauthorizedHandler(() => navigationRef.navigate('Signin'))
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
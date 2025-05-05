import React, { useEffect, useState } from 'react'
import { saveToken, clearToken, signinRequest, logoutRequest, setAuthHeader, clearAuthHeader, getProfile } from '@services'
import { trySigninFromStoredToken } from '@services'
import { navigate } from '../navigation'
import { createContext } from 'react'
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
    setUser: async () => {},
})

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
  
	const login = async (email: string, password: string) => {
        const { accessToken, user: userProfile } = await signinRequest(email, password)
        console.log('userProfile', userProfile)
        await saveToken(accessToken)
        setAuthHeader(accessToken)
        const profile = await getProfile()
        console.log('profile', profile)
        setUser(profile)
        setIsAuthenticated(true)
        navigate('Home')
    }
  
	const logout = async () => {
        await logoutRequest()
        await clearToken()
        clearAuthHeader()
        setIsAuthenticated(false)
        setUser(null)
        navigate('Signin')
    }
    
    useEffect(() => {
        const initialize = async () => {
            const profile = await trySigninFromStoredToken()
            console.log('PROFILE', profile)
            if (profile) {
                setUser(profile)
                setIsAuthenticated(true)
                // navigate('Home')
            } else {
                navigate('Signin')
            }
        }
    
        initialize()
    }, [])

    useEffect(() => {
        console.log('***', user)
    }, [user])
  
	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	)
}
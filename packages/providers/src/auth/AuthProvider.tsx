import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { saveToken, clearToken, signinRequest, logoutRequest, setAuthHeader, clearAuthHeader } from '@services'
import { User } from '@iam/types'
import { trySigninFromStoredToken } from '@services'
import { navigate } from '@navigation'  // Assuming you've set up a custom navigation handler

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
  
	// Login function
	const login = async (email: string, password: string) => {
        const { accessToken, user: userProfile } = await signinRequest(email, password)
        await saveToken(accessToken)  // Save the token
        setAuthHeader(accessToken)    // Set the token in headers
        setUser(userProfile)  // Set the user state
        setIsAuthenticated(true)  // Update authentication status
        navigate('Home')
    }
  
	// Logout function
	const logout = async () => {
        await logoutRequest()  // Make the logout request
        await clearToken()  // Clear the stored token
        clearAuthHeader()  // Remove the auth header
        setIsAuthenticated(false)  // Update authentication status
        setUser(null)  // Clear user info
        navigate('Signin')
    }
    
	// Initialize on mount, check stored token, and redirect if not signed in
    useEffect(() => {
        const initialize = async () => {
            const profile = await trySigninFromStoredToken()  // Try to sign in from a stored token
            if (profile) {
                setUser(profile)  // Set the user info
                setIsAuthenticated(true)  // Mark as authenticated
                navigate('Home')
            } else {
                navigate('Signin')
            }
        }
    
        initialize()  // Call initialize
    }, [])
  
	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
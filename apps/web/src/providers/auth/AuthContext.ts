// import type { User } from '@/types/User' // if you have a type
import { createContext } from 'react'

export type AuthContextType = {
	user: any//User | null
	// setUser: (user: User | null) => void
	// isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
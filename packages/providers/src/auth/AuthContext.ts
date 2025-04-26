// import type { User } from '@/types/User'

import { createContext } from 'react'
import { User } from '@iam/types'

export interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    authReady: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
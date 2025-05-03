// /packages/providers/src/auth/AuthContext.ts

import { createContext } from 'react'
import type { User } from '@iam/types'

export type AuthContextType = {
	isAuthenticated: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	user: null,
	login: async () => {},
	logout: async () => {},
})
// /packages/providers/src/user/UserContext.ts

import { createContext } from 'react'

export interface UserContextType {
    email: string | null
    setEmail: (email: string | null) => Promise<void>
    logout: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
// apps/web/src/features/auth/hooks/useAuth.ts

import { useContext } from 'react'
import { AuthContext, AuthContextType } from '..'

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within an AuthProvider')
	return context
}
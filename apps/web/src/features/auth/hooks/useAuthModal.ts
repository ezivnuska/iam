// apps/web/src/features/auth/hooks/useAuthModal.ts

import { useContext } from 'react'
import { AuthModalContext, AuthModalContextType } from '../'

export const useAuthModal = (): AuthModalContextType => {
    const context = useContext(AuthModalContext)
    if (!context) throw new Error('useAuthModal must be used within AuthModalProvider')
    return context
}
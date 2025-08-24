// apps/web/src/shared/navigation/components/ProtectedRoute.tsx

import React, { useEffect } from 'react'
import { LoadingPanel } from '@shared/ui'
import { useAuth } from '@features/auth'

type Props = {
	children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
	const { disconnecting, isAuthenticated, showAuthModal } = useAuth()
    
    useEffect(() => {
        if (!isAuthenticated && !disconnecting) {
            showAuthModal(true)
        }
    }, [])

	return !isAuthenticated
        ? <LoadingPanel label='Authenticating...' />
        : children
}

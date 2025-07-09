// apps/web/src/navigation/ProtectedRoute.tsx

import React, { useEffect } from 'react'
import { LoadingScreen } from '@/screens'
import { AuthModal } from '@/components'
import { useAuth, useModal } from '@/hooks'
import { navigate } from '@/navigation'

type Props = {
	children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
	const { authenticate, isAuthenticated } = useAuth()
	const { showModal } = useModal()
    
    useEffect(() => {
        if (!isAuthenticated) {
            console.log('PROTECTED ROUTE: showing auth modal')
            showModal(
                <AuthModal
                    initialMode='signin'
                    authenticate={authenticate}
                    onDismiss={handleDismiss}
                />
            )
        }
    }, [])

    const handleDismiss = () => {
        navigate('Home')
    }

	return !isAuthenticated
        ? <LoadingScreen label='Authenticating...' />
        : children
}

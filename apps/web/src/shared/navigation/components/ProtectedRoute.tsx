// apps/web/src/shared/navigation/components/ProtectedRoute.tsx

import React, { useEffect } from 'react'
import { AuthModal } from '@shared/modals'
import { LoadingPanel } from '@shared/ui'
import { useAuth, useModal } from '@shared/hooks'
import { navigate } from '@shared/navigation'

type Props = {
	children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
	const { isAuthenticated } = useAuth()
	const { showModal } = useModal()
    
    useEffect(() => {
        if (!isAuthenticated) {
            console.log('PROTECTED ROUTE: showing auth modal')
            showModal(<AuthModal onDismiss={handleDismiss} />)
        }
    }, [])

    const handleDismiss = () => {
        navigate('Feed')
    }

	return !isAuthenticated
        ? <LoadingPanel label='Authenticating...' />
        : children
}

// apps/web/src/navigation/ProtectedRoute.tsx

import React, { useEffect } from 'react'
import { SigninForm, Spinner } from '@/components'
import { useAuth, useModal } from '@/hooks'
import { navigate } from '@/navigation'

type Props = {
	children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
	const { authenticate, isAuthenticated } = useAuth()
	const { openFormModal } = useModal()
    
    useEffect(() => {
        if (!isAuthenticated) {
            console.log('PROTECTED ROUTE: showing auth modal')
            openFormModal(SigninForm, { onDismiss: handleDismiss }, { title: 'Sign In' })
        }
    }, [])

    const handleDismiss = () => {
        navigate('Home')
    }

	return !isAuthenticated
        ? <Spinner label='Authenticating...' />
        : children
}

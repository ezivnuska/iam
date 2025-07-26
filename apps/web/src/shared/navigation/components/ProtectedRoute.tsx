// apps/web/src/shared/navigation/components/ProtectedRoute.tsx

import React, { useEffect } from 'react'
import { SigninForm } from '@shared/forms'
import { Spinner } from '@shared/ui'
import { useAuth, useModal } from '@shared/hooks'
import { navigate } from '@shared/navigation'

type Props = {
	children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
	const { isAuthenticated } = useAuth()
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

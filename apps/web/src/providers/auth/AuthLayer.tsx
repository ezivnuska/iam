// apps/web/src/providers/auth/AuthLayer.tsx

import React, { useEffect } from 'react'
import { View } from 'react-native'
import { SigninForm } from '@/components'
import { useAuth, useModal, useTheme } from '@/hooks'
import { navigate } from '@/navigation'
import { setUnauthorizedHandler } from '@services'

// AuthLayer is required to handle unauthorized modal display
// because useModal() is not accessible from within AuthProvider

export const AuthLayer: React.FC<{
    children: React.ReactNode
}> = ({
	children,
}) => {
	const { authenticate } = useAuth()
	const { openFormModal, hideAllModals } = useModal()
	const { theme } = useTheme()

	useEffect(() => {
		setUnauthorizedHandler(() => {
			showAuthModal()
		})
	}, [])

	const showAuthModal = () => {
		console.log('AUTH LAYER: showing auth modal')
		openFormModal(SigninForm, { onDismiss: handleClose }, { title: 'Sign In' })
	}

    const handleClose = () => {
        try {
            navigate('Home')
        } finally {
			hideAllModals()
		}
    }

	return (
		<View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
			{children}
		</View>
	)
}

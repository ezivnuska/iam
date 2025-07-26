// apps/web/src/features/auth/AuthLayer.tsx

import React, { useEffect } from 'react'
import { View } from 'react-native'
// import { SigninForm } from '@shared/forms'
import { AuthModal } from '@shared/modals'
import { useAuth, useModal, useTheme } from '@shared/hooks'
import { navigate } from '@shared/navigation'
import { setUnauthorizedHandler } from '@services'

// AuthLayer is required to handle unauthorized modal display
// because useModal() is not accessible from within AuthProvider

export const AuthLayer: React.FC<{
    children: React.ReactNode
}> = ({
	children,
}) => {
	const { authenticate } = useAuth()
	const { openFormModal, hideAllModals, showModal } = useModal()
	const { theme } = useTheme()

	useEffect(() => {
		setUnauthorizedHandler(() => {
			showAuthModal()
		})
	}, [])

	const showAuthModal = () => {
		console.log('AUTH LAYER: showing auth modal')
		showModal(<AuthModal onDismiss={handleClose} authenticate={authenticate} />)
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

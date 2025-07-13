// apps/web/src/providers/auth/AuthLayer.tsx

import React, { useEffect } from 'react'
import { View } from 'react-native'
import { AuthModal } from '@/components'
import { useAuth, useModal, useTheme } from '@/hooks'
import { setUnauthorizedHandler } from '@services'

// AuthLayer is required to handle unauthorized modal display
// because useModal() is not accessible from within AuthProvider

export const AuthLayer: React.FC<{
    children: React.ReactNode
}> = ({
	children,
}) => {
	const { authenticate } = useAuth()
	const { showModal } = useModal()
	const { theme } = useTheme()

	useEffect(() => {
		setUnauthorizedHandler(() => {
			showAuthModal()
		})
	}, [])

	const showAuthModal = () => {
		console.log('AUTH LAYER: showing auth modal')
		showModal(
			<AuthModal
				initialMode='signin'
				authenticate={authenticate}
			/>
		)
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

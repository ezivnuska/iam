// apps/web/src/providers/auth/AuthLayer.tsx

import React, { useEffect } from 'react'
import { AuthModal } from '@/components'
import { useAuth, useModal } from '@/hooks'
import { setUnauthorizedHandler } from '@services'
import { SafeAreaView } from 'react-native-safe-area-context'

// AuthLayer is required to handle unauthorized modal display
// because useModal() is not accessible from within AuthProvider

export const AuthLayer: React.FC<{
    children: React.ReactNode
}> = ({
	children,
}) => {
	const { authenticate } = useAuth()
	const { showModal } = useModal()

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
		<SafeAreaView style={{ flex: 1 }}>
			{children}
		</SafeAreaView>
	)
}

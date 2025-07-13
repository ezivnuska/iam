// apps/web/src/providers/auth/AuthLayer.tsx

import React, { useEffect } from 'react'
import { AuthModal } from '@/components'
import { useAuth, useModal, useTheme } from '@/hooks'
import { setUnauthorizedHandler } from '@services'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'

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
    const insets = useSafeAreaInsets()

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
		<SafeAreaView
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: theme.colors.background,
            }}
        >
			{children}
		</SafeAreaView>
	)
}

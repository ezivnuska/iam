// apps/web/src/features/auth/AuthLayer.tsx

import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useAuth } from '.'
import { useTheme } from '@shared/hooks'
import { setUnauthorizedHandler } from '@iam/services'

// AuthLayer is required to handle unauthorized modal display
// because useModal() is not accessible from within AuthProvider

export const AuthLayer: React.FC<{
    children: React.ReactNode
}> = ({
	children,
}) => {
	const { showAuthModal } = useAuth()
	const { theme } = useTheme()

	useEffect(() => {
		setUnauthorizedHandler(() => {
			showAuthModal(true)
		})
	}, [])

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			{children}
		</View>
	)
}

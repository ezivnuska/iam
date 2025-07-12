// apps/web/src/screens/LoadingScreen.tsx

import React from 'react'
import { View } from 'react-native'
import { Spinner } from '@/components'
import { useTheme } from '@/hooks'

type LoadingScreenProps = {
    label?: string
}

export const LoadingScreen = ({
    label = 'Loading...',
}: LoadingScreenProps) => {
    const { theme } = useTheme()
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Spinner label={label} />
		</View>
	)
}

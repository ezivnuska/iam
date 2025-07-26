// apps/web/src/shared/ui/LoadingPanel.tsx

import React from 'react'
import { View } from 'react-native'
import { Spinner } from '@shared/ui'
import { useTheme } from '@shared/hooks'

type LoadingPanelProps = {
    label?: string
}

export const LoadingPanel = ({
    label = 'Loading...',
}: LoadingPanelProps) => {
    const { theme } = useTheme()
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Spinner label={label} />
		</View>
	)
}

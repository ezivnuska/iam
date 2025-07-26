// apps/web/src/features/home/components/HomeView.tsx

import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@shared/hooks'
import { PageHeader } from '@shared/ui'

export const HomeView = () => {
	const { theme } = useTheme()

	return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <PageHeader title='Home' />
        </View>
	)
}

// apps/web/src/components/home/HomeView.tsx

import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@/hooks'
import { PageHeader } from '../ui'

export const HomeView = () => {
	const { theme } = useTheme()

	return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <PageHeader title='Home' />
        </View>
	)
}

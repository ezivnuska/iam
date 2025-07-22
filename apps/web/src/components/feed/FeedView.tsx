// apps/web/src/components/feed/FeedView.tsx

import React from 'react'
import { View } from 'react-native'
import { FeedList } from '@/components'
import { useTheme } from '@/hooks'

export const FeedView = () => {
	const { theme } = useTheme()

	return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <FeedList />
        </View>
	)
}

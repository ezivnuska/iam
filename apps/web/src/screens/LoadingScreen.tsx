// apps/web/src/screens/AppLoadingScreen.tsx

import React from 'react'
import { View } from 'react-native'
import { Spinner } from '@/components'

type LoadingScreenProps = {
    color?: string
    label?: string
}

export const LoadingScreen = ({
    color = '#000',
    label = 'Loading...',
}: LoadingScreenProps) => {

	return (
		<View style={{ flex: 1, backgroundColor: color }}>
            <Spinner label={label} />
		</View>
	)
}

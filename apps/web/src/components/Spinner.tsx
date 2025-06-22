// apps/web/src/components/Spinner.tsx

import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { Size } from '@/styles'

export interface SpinnerProps {
	size?: number
}

export const Spinner: React.FC<SpinnerProps> = ({
	size = 50,
}) => (
    <View style={styles.container}>
        <ActivityIndicator color='#fff' size={size} />
    </View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
        paddingVertical: Size.XS,
	},
})

// apps/web/src/components/Spinner.tsx

import React from 'react'
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'
import { Size } from '@/styles'
import { Column } from '@/components'

export interface SpinnerProps {
	size?: number
    label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
	size = 50,
    label,
}) => (
    <View style={styles.outerContainer}>
        <Column spacing={20} justify='center'>
            <ActivityIndicator color='#fff' size={size} />
            {label && <Text style={styles.label}>{label}</Text>}
        </Column>
    </View>
)

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
        paddingVertical: Size.XS,
	},
	label: {
        color: '#fff',
        textAlign: 'center',
	},
})

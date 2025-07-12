// apps/web/src/components/Spinner.tsx

import React from 'react'
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'
import { Size } from '@iam/theme'
import { Column } from '@/components'
import { useTheme } from '@/hooks'

export interface SpinnerProps {
	size?: number
    label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
	size = 50,
    label,
}) => {
    const { theme } = useTheme()
    return (
        <View style={styles.outerContainer}>
            <Column spacing={20} justify='center'>
                <ActivityIndicator color={theme.colors.text} size={size} />
                {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
            </Column>
        </View>
    )
}

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
        paddingVertical: Size.XS,
	},
	label: {
        textAlign: 'center',
	},
})

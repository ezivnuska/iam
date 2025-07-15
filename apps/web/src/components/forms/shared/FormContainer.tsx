// apps/web/src/components/forms/shared/FormContainer.tsx

import React, { ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Column } from '@/components'
import { useTheme } from '@/hooks'
import { Size } from '@iam/theme'

interface FormContainerProps {
	children: ReactNode
	title?: string
	subtitle?: string
}

export const FormContainer: React.FC<FormContainerProps> = ({
	children,
	title,
	subtitle,
}) => {
    const { theme } = useTheme()
	return (
        <Column
            flex={1}
            style={styles.content}
        >
            {!!title && (
                <>
                    <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
                    {subtitle && <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
                </>
            )}
            
            <View style={styles.main}>
                {children}
            </View>
        </Column>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: '600',
        paddingBottom: 12,
	},
	subtitle: {
		marginTop: 4,
		fontSize: 16,
	},
	content: {
		flex: 1,
		width: '100%',
		maxWidth: 400,
		minWidth: 300,
		alignSelf: 'center',
	},
	main: {
		flex: 1,
	},
})

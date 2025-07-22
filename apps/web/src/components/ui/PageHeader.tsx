// apps/web/src/components/ui/PageHeader.tsx

import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { useTheme } from '@/hooks'
import { resolveResponsiveProp } from '@iam/theme'

interface PageHeaderProps {
    title?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    const { theme } = useTheme()
    const fontSize = resolveResponsiveProp({ xs: 26, sm: 26, md: 30, lg: 30 })
    const lineHeight = fontSize * 1.1
	return (
        <Text style={[styles.heading, { fontSize, lineHeight, color: theme.colors.text }]}>
            {title}
        </Text>
	)
}

const styles = StyleSheet.create({
    heading: {
        // fontWeight: 600,
    }
})
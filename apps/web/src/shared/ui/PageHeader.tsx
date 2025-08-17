// apps/web/src/shared/ui/PageHeader.tsx

import React from 'react'
import { Text } from 'react-native'
import { useTheme } from '@shared/hooks'
import { resolveResponsiveProp } from '@iam/theme'

interface PageHeaderProps {
    title?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    const { theme } = useTheme()
    const fontSize = resolveResponsiveProp({ xs: 18, sm: 22, md: 22, lg: 24 })
	return (
        <Text style={{ fontSize, color: theme.colors.text }}>
            {title}
        </Text>
	)
}
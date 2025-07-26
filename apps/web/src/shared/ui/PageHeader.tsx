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
    const fontSize = resolveResponsiveProp({ xs: 26, sm: 26, md: 30, lg: 30 })
	return (
        <Text style={{ fontSize, color: theme.colors.text }}>
            {title}
        </Text>
	)
}
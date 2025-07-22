// apps/web/src/components/layout/Brand.tsx

import React from 'react'
import { Pressable, Text } from 'react-native'
import { Row } from '@/components'
import { useTheme } from '@/hooks'
import { useCurrentRoute } from '@/hooks/useCurrentRoute'
import { resolveResponsiveProp } from '@iam/theme'
import { navigate } from '@/navigation'

export const Brand: React.FC = () => {
    const { theme } = useTheme()
    const currentRoute = useCurrentRoute()
    const fontSize = resolveResponsiveProp({ xs: 34, sm: 34, md: 40, lg: 40 })
    const lineHeight = fontSize * 0.9

    return (
        <Pressable
            onPress={() => navigate('Home')}
            disabled={currentRoute === 'Home'}
        >
            <Row wrap justify='center'>
                <Text style={{ fontSize, lineHeight, color: theme.colors.primary }}>iam</Text>
                <Text style={{ fontSize, lineHeight, color: theme.colors.secondary }}>eric</Text>
            </Row>
        </Pressable>
    )
}

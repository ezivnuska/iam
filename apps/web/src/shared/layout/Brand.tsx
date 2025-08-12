// apps/web/src/shared/layout/Brand.tsx

import React from 'react'
import { Pressable, Text } from 'react-native'
import { Row } from '@shared/grid'
import { useTheme } from '@shared/hooks'
import { resolveResponsiveProp } from '@iam/theme'
import { navigate, useCurrentRoute } from '@shared/navigation'

export const Brand: React.FC = () => {
    const { theme } = useTheme()
    const currentRoute = useCurrentRoute()
    const fontSize = resolveResponsiveProp({ xs: 20, sm: 26, md: 32, lg: 40 })
    const lineHeight = fontSize + 8
    return (
        <Pressable
            onPress={() => navigate('Feed')}
            disabled={currentRoute === 'Feed'}
        >
            <Row wrap align='center' justify='center'>
                <Text style={{ fontSize, lineHeight, color: theme.colors.primary }}>iam</Text>
                <Text style={{ fontSize, lineHeight, color: theme.colors.secondary }}>eric</Text>
            </Row>
        </Pressable>
    )
}

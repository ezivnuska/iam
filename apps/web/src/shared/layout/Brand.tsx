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
    const fontSize = resolveResponsiveProp({ xs: 34, sm: 34, md: 40, lg: 40 })
    const lineHeight = fontSize * 0.9

    return (
        <Pressable
            onPress={() => navigate('Home')}
            disabled={currentRoute === 'Home'}
            style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Row wrap align='center' justify='center'>
                <Text style={{ fontSize, lineHeight, color: theme.colors.primary }}>iam</Text>
                <Text style={{ fontSize, lineHeight, color: theme.colors.secondary }}>eric</Text>
            </Row>
        </Pressable>
    )
}

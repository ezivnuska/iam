// apps/web/src/components/ui/Screen.tsx

import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@/hooks'
import { paddingHorizontal, paddingVertical } from '@iam/theme'

export const Screen: React.FC<{
    children: React.ReactNode
}> = ({
    children,
}) => {
    const { theme } = useTheme()

    return (
        <View
            style={{
                flex: 1,
                alignSelf: 'stretch',
                paddingHorizontal,
                paddingVertical,
                backgroundColor: theme.colors.background,
            }}
        >
            {children}
        </View>
    )
}

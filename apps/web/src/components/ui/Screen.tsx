// apps/web/src/components/ui/Screen.tsx

import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@/hooks'
import { paddingHorizontal, Size } from '@iam/theme'

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
                paddingVertical: Size.L,
                backgroundColor: theme.colors.background,
            }}
        >
            {children}
        </View>
    )
}

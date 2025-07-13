// apps/web/src/components/layout/ScreenLayout.tsx

import React from 'react'
import { View } from 'react-native'
import { Header, FlexBox } from '@/components'
import { MAX_WIDTH } from './constants'
import type { ScreenLayoutProps } from '@/types'
import { useDeviceInfo, useTheme } from '@/hooks'
import { resolveResponsiveProp } from '@iam/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ nav, children }) => {
	const { theme } = useTheme()
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    const paddingHorizontal = resolveResponsiveProp({ xs: 10, sm: 12, md: 18, lg: 24 })
    const paddingVertical = resolveResponsiveProp({ xs: 4, sm: 8, md: 12, lg: 24 })
    const insets = useSafeAreaInsets()
	return (
        <FlexBox
            flex={1}
            direction={isLandscape ? 'row' : 'column'}
            align={isLandscape ? 'flex-start' : 'center'}
            style={{
                alignItems: 'stretch',
                backgroundColor: theme.colors.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
        >
            <Header>
                {nav}
            </Header>
            <View style={{ flex: 1, paddingHorizontal, paddingVertical, alignSelf: 'stretch' }}>
                {children}
            </View>
        </FlexBox>
	)
}
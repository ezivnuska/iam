// apps/web/src/shared/layout/ScreenContainer.tsx

import React from 'react'
import { View } from 'react-native'
import { Column } from '@shared/grid'
import { useDeviceInfo, useTheme } from '@shared/hooks'
import { HeaderContainer } from '..'

interface ScreenContainerProps<HProps extends object = {}, SProps extends object = {}> {
    header?: React.ComponentType<HProps>
    headerProps?: HProps
    screen: React.ComponentType<SProps>
    screenProps?: SProps
}

export function ScreenContainer<HProps extends object = {}, SProps extends object = {}>({
    header: HeaderComponent,
    headerProps,
    screen: ScreenComponent,
    screenProps,
}: ScreenContainerProps<HProps, SProps>) {
    const { theme } = useTheme()
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    return (
        <Column flex={1} style={{ paddingHorizontal: 12, backgroundColor: theme.colors.background }}>
            
            {HeaderComponent && (
                <HeaderContainer>
                    <HeaderComponent {...(headerProps as HProps)} />
                </HeaderContainer>
            )}
            
            <View style={{ flex: 1, flexGrow: 1, backgroundColor: theme.colors.background }}>
                <ScreenComponent {...(screenProps as SProps)} />
            </View>
        </Column>
    )
}

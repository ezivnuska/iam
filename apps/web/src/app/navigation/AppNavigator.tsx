// apps/web/src/app/navigation/AppNavigator.tsx

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { RootNavigator } from '.'
import { navigationRef } from '@shared/navigation'
import { linking } from './linking'
import { FlexBox } from '@shared/grid'
import { Header } from '@shared/layout'
import { LoadingPanel } from '@shared/ui'
import { useAuth, useTheme, useDeviceInfo } from '@shared/hooks'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'

export const AppNavigator = () => {
	const { isAuthInitialized } = useAuth()
	const { theme } = useTheme()
	const { orientation } = useDeviceInfo()
	const isLandscape = orientation === 'landscape'
	const insets = useSafeAreaInsets()
	
    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: theme.colors.background,
            }}
        >
            <NavigationContainer ref={navigationRef} linking={linking}>
				{isAuthInitialized
                    ? (
                        <FlexBox
                            flex={1}
                            direction={isLandscape ? 'row' : 'column'}
                            align={isLandscape ? 'flex-start' : 'center'}
                            style={{ alignItems: 'stretch' }}
                        >
                            <Header />
                            <RootNavigator />
                        </FlexBox>
                    )
                    : <LoadingPanel label='Initializing...' />
                }
            </NavigationContainer>
        </SafeAreaView>
    )
}

// apps/web/src/navigation/AppNavigator.tsx

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef, RootNavigator } from '.'
import { linking } from '@/navigation'
import { FlexBox, Header } from '@/components'
import { useAuth, useTheme, useDeviceInfo } from '@/hooks'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import { LoadingScreen } from '@/screens'
import { paddingHorizontal } from '@iam/theme'


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
				<FlexBox
					flex={1}
					direction={isLandscape ? 'row' : 'column'}
					align={isLandscape ? 'flex-start' : 'center'}
                    spacing={isLandscape ? paddingHorizontal : 0}
					style={{
						alignItems: 'stretch',
						backgroundColor: theme.colors.background,
                        paddingHorizontal,
					}}
				>
					<Header />
                    {isAuthInitialized
                        ? <RootNavigator />
                        : <LoadingScreen label='Authenticating...' />
                    }
				</FlexBox>
            </NavigationContainer>
        </SafeAreaView>
    )
}

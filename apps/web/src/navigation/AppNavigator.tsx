// apps/web/src/navigation/AppNavigator.tsx

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef, RootNavigator } from '.'
import { linking } from '@/navigation'
import { FlexBox, Header } from '@/components'
import { useAuth, useTheme, useDeviceInfo } from '@/hooks'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import { LoadingScreen } from '@/screens'


export const AppNavigator = () => {
	const { isAuthInitialized } = useAuth()
	const { theme } = useTheme()
	const { orientation, isMobile } = useDeviceInfo()
	const isLandscape = orientation === 'landscape'
	const insets = useSafeAreaInsets()
	const mobilePadding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    }
    return (
        <SafeAreaView
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                },
                isMobile && mobilePadding,
                !isMobile && {
                    marginVertical: 0,
                    marginHorizontal: isLandscape ? 20 : 0,
                },
            ]}
        >
            <NavigationContainer ref={navigationRef} linking={linking}>
				<FlexBox
					flex={1}
					direction={isLandscape ? 'row' : 'column'}
					align={isLandscape ? 'flex-start' : 'center'}
					style={{
						alignItems: 'stretch',
						backgroundColor: theme.colors.background,
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

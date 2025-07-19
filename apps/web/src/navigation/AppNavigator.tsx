// apps/web/src/navigation/AppNavigator.tsx

import React from 'react'
import { View } from 'react-native'
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
	const { orientation } = useDeviceInfo()
	const isLandscape = orientation === 'landscape'
	const insets = useSafeAreaInsets()
	
    return (
        <NavigationContainer ref={navigationRef} linking={linking}>
			<SafeAreaView
				style={{
					flex: 1,
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				}}
			>
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
					<View style={{ flex: 1, alignSelf: 'stretch' }}>
						{isAuthInitialized
                            ? <RootNavigator />
                            : <LoadingScreen label='Authenticating...' />
                        }
					</View>
				</FlexBox>
			</SafeAreaView>
        </NavigationContainer>
    )
}

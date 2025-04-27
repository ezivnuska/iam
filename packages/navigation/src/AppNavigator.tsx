// packages/navigation/src/AppNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createNavigationContainerRef } from '@react-navigation/native'
import {
    DetailsScreen,
    ForgotPasswordScreen,
    HomeScreen,
    SigninScreen,
    SignupScreen,
    ResetPasswordScreen,
    ProfileScreen,
    UserListScreen,
} from '@screens'
import type { RootStackParamList } from '@iam/types'

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="UserList" component={UserListScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    )
}

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigate<RouteName extends keyof RootStackParamList>(
    screen: RouteName,
    ...[params]: RootStackParamList[RouteName] extends undefined
        ? []
        : [params: RootStackParamList[RouteName]]
) {
    if (navigationRef.isReady()) {
        // @ts-ignore - force type to avoid version mismatch
        navigationRef.navigate(screen, ...(params ? [params] : []))
    }
}

export function resetTo<RouteName extends keyof RootStackParamList>(
        screen: RouteName,
        params?: RootStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [
            params !== undefined
                ? { name: screen, params }
                : { name: screen },
            ],
        })
    }
}

// Optional: goBack helper
export function goBack() {
    if (navigationRef.canGoBack()) {
        navigationRef.goBack()
    }
}
// apps/web/src/navigation/AppNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    ChatScreen,
    ForgotPasswordScreen,
    HomeScreen,
    ResetPasswordScreen,
    PrivacyPolicyScreen,
    UserListScreen,
    UserProfileScreen,
} from '@/screens'
import { navigationRef } from '.'
import { NavigationContainer } from '@react-navigation/native'
import { linking } from '@/linking'
import { withProtectedRoute } from './withProtectedRoute'
import type { RootStackParamList } from '@iam/types'

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
    return (
        <NavigationContainer ref={navigationRef} linking={linking}>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Chat' component={withProtectedRoute(ChatScreen)} />
                <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
                <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicyScreen} />
                <Stack.Screen name='UserProfile' component={withProtectedRoute(UserProfileScreen)} />
                <Stack.Screen name='Profile' component={withProtectedRoute(UserProfileScreen)} />
                <Stack.Screen name='UserList' component={withProtectedRoute(UserListScreen)} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
// apps/web/src/navigation/AppNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    ChatScreen,
    DetailsScreen,
    ForgotPasswordScreen,
    HomeScreen,
    ResetPasswordScreen,
    PrivacyPolicyScreen,
    ProfileScreen,
    SigninScreen,
    UserListScreen,
} from '../screens'
import { navigationRef } from './'
import { NavigationContainer } from '@react-navigation/native'
import { linking } from '@/linking'
import type { RootStackParamList } from '@iam/types'

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
    return (
        <NavigationContainer ref={navigationRef} linking={linking}>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Chat' component={ChatScreen} />
                <Stack.Screen name='Details' component={DetailsScreen} />
                <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
                <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicyScreen} />
                <Stack.Screen name='Profile' component={ProfileScreen} />
                <Stack.Screen name='Signin' component={SigninScreen} />
                <Stack.Screen name='UserList' component={UserListScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
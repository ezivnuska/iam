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
} from '@/screens'
import { withProtectedRoute } from './withProtectedRoute'
import type { RootStackParamList } from '@iam/types'
import { ProfileNavigator } from './ProfileNavigator'
import { UserNavigator } from './UserNavigator'

const Stack = createStackNavigator<RootStackParamList>()

export const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Chat' component={withProtectedRoute(ChatScreen)} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
            <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicyScreen} />
            <Stack.Screen name='Profile' component={ProfileNavigator} />
            {/* <Stack.Screen name='UserList' component={UserListScreen} /> */}
            <Stack.Screen name='Users' component={UserNavigator} />
        </Stack.Navigator>
    )
}
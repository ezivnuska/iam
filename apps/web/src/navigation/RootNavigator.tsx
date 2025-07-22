// apps/web/src/navigation/RootNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    ChatScreen,
    HomeScreen,
    ForgotPasswordScreen,
    ResetPasswordScreen,
    PrivacyPolicyScreen,
    ProfileScreen,
    FeedScreen,
} from '@/screens'
import type { RootStackParamList } from '@iam/types'
import { UserNavigator } from '@/navigation'

const Stack = createStackNavigator<RootStackParamList>()

export const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='Feed'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Feed' component={FeedScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
            <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicyScreen} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='Users' component={UserNavigator} />
        </Stack.Navigator>
    )
}

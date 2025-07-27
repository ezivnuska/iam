// apps/web/src/app/navigation/RootNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { 
    ForgotPasswordScreen,
    ResetPasswordScreen,
    PrivacyPolicyScreen,
} from '@features/auth'
import { ChatScreen } from '@features/chat'
import { HomeScreen } from '@features/home'
import { ProfileScreen } from '@features/profile'
import { FeedScreen } from '@features/feed'
import type { RootStackParamList } from '@iam/types'
import { UserNavigator } from '@features/users'

const Stack = createStackNavigator<RootStackParamList>()

export const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='Feed'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='Home' component={FeedScreen} />
            <Stack.Screen name='Feed' component={FeedScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
            <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicyScreen} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='Users' component={UserNavigator} />
        </Stack.Navigator>
    )
}

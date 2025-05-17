// apps/web/src/navigation/AppNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    ChatScreen,
    DetailsScreen,
    FeedScreen,
    ForgotPasswordScreen,
    HomeScreen,
    ResetPasswordScreen,
    ProfileScreen,
    UserListScreen,
} from '../screens'
import type { RootStackParamList } from '@iam/types'

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='Details' component={DetailsScreen} />
            <Stack.Screen name='Feed' component={FeedScreen} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
            <Stack.Screen name='UserList' component={UserListScreen} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
        </Stack.Navigator>
    )
}
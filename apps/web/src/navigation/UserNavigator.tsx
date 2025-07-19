// apps/web/src/navigation/UserNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { UserImagesScreen, UserListScreen, UserProfileScreen } from '@/screens'
import { withProtectedRoute } from './withProtectedRoute'
import type { UserStackParamList } from '@iam/types'

const Stack = createStackNavigator<UserStackParamList>()

export const UserNavigator = () => (
    <Stack.Navigator
        initialRouteName='UserList'
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name='UserList' component={withProtectedRoute(UserListScreen)} />
        <Stack.Screen name='UserProfile' component={withProtectedRoute(UserProfileScreen)} />
        <Stack.Screen name='UserImages' component={withProtectedRoute(UserImagesScreen)} />
    </Stack.Navigator>
)

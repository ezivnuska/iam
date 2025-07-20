// apps/web/src/navigation/UserProfileNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { UserProfileScreen, UserImagesScreen } from '@/screens'
import { withProtectedRoute } from './withProtectedRoute'
import type { UserProfileStackParamList } from '@iam/types'

const Stack = createStackNavigator<UserProfileStackParamList>()

export const UserProfileNavigator = () => (
    <Stack.Navigator initialRouteName='UserProfile' screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name='UserProfile'
            component={withProtectedRoute(UserProfileScreen)}
        />
        <Stack.Screen
            name='UserImages'
            component={withProtectedRoute(UserImagesScreen)}
        />
    </Stack.Navigator>
)

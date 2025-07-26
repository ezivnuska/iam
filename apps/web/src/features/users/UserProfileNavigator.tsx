// apps/web/src/features/users/UserProfileNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { UserImagesView, UserProfileView } from './components'
import { withProtectedRoute } from '@shared/navigation'
import type { UserProfileStackParamList } from '@iam/types'

const Stack = createStackNavigator<UserProfileStackParamList>()

export const UserProfileNavigator = () => (
    <Stack.Navigator
        initialRouteName='Main'
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen
            name='Main'
            component={withProtectedRoute(UserProfileView)}
        />
        <Stack.Screen
            name='UserImages'
            component={withProtectedRoute(UserImagesView)}
        />
    </Stack.Navigator>
)

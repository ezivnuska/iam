// apps/web/src/navigation/ProfileNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ImagesScreen, ProfileScreen } from '@/screens'
import { withProtectedRoute } from './withProtectedRoute'
import type { ProfileStackParamList } from '@iam/types'

const Stack = createStackNavigator<ProfileStackParamList>()

export const ProfileNavigator = () => (
    <Stack.Navigator
        initialRouteName='Main'
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name='Main' component={withProtectedRoute(ProfileScreen)} />
        <Stack.Screen name='Images' component={withProtectedRoute(ImagesScreen)} />
    </Stack.Navigator>
)

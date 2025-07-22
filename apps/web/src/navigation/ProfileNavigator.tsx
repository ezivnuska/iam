// apps/web/src/navigation/ProfileNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withProtectedRoute } from './withProtectedRoute'
import type { ProfileStackParamList } from '@iam/types'
import { ProfileImagesView, ProfileView } from '@/components'

const Stack = createStackNavigator<ProfileStackParamList>()

export const ProfileNavigator = () => (
    <Stack.Navigator
        initialRouteName='Main'
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name='Main' component={withProtectedRoute(ProfileView)} />
        <Stack.Screen name='Images' component={withProtectedRoute(ProfileImagesView)} />
    </Stack.Navigator>
)

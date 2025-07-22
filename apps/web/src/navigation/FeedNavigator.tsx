// apps/web/src/navigation/FeedNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withProtectedRoute } from './withProtectedRoute'
import type { FeedStackParamList } from '@iam/types'
import { FeedView } from '@/components'

const Stack = createStackNavigator<FeedStackParamList>()

export const FeedNavigator = () => (
    <Stack.Navigator initialRouteName='FeedList' screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name='FeedList'
            component={withProtectedRoute(FeedView)}
        />
    </Stack.Navigator>
)

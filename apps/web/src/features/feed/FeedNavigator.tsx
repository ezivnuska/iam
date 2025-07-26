// apps/web/src/features/feed/FeedNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import type { FeedStackParamList } from '@iam/types'
import { FeedList } from './components'

const Stack = createStackNavigator<FeedStackParamList>()

export const FeedNavigator = () => (
    <Stack.Navigator initialRouteName='FeedList' screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name='FeedList'
            component={FeedList}
        />
    </Stack.Navigator>
)

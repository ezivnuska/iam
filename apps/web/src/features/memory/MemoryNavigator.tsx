// apps/web/src/features/feed/FeedNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import type { MemoryStackParamList } from '@iam/types'
import { MemoryList } from './components'

const Stack = createStackNavigator<MemoryStackParamList>()

export const MemoryNavigator = () => (
    <Stack.Navigator initialRouteName='MemoryList' screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name='MemoryList'
            component={MemoryList}
        />
    </Stack.Navigator>
)

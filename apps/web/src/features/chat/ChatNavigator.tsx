// apps/web/src/features/chat/ChatNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withProtectedRoute } from '@shared/navigation'
import type { ChatStackParamList } from '@iam/types'
import { ChatView } from './components'

const Stack = createStackNavigator<ChatStackParamList>()

export const ChatNavigator = () => (
    <Stack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name='Main'
            component={withProtectedRoute(ChatView)}
        />
    </Stack.Navigator>
)

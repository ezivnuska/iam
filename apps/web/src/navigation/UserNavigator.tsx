// apps/web/src/navigation/UserNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { UsersScreen } from '@/screens'
import { withProtectedRoute } from './withProtectedRoute'
import type { UserStackParamList } from '@iam/types'
import { UserView } from '@/components'

const Stack = createStackNavigator<UserStackParamList>()

export const UserNavigator = () => (
    <Stack.Navigator
        initialRouteName='UserList'
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name='UserList' component={withProtectedRoute(UsersScreen)} />
        <Stack.Screen name='User' component={UserView} />
    </Stack.Navigator>
)

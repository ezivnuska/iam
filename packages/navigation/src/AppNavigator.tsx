// packages/navigation/src/AppNavigator.tsx

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    DetailsScreen,
    ForgotPasswordScreen,
    HomeScreen,
    SigninScreen,
    SignupScreen,
    ResetPasswordScreen,
} from '@screens'
import type { RootStackParamList } from '@iam/types'

const Stack = createStackNavigator<RootStackParamList>()

export const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
    )
}
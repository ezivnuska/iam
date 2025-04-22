// apps/web/src/providers/AppProviders.tsx

import { ReactNode } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@services/navigation'
import { AuthProvider, ModalProvider } from '@providers'
import * as Linking from 'expo-linking'

const linking = {
    prefixes: ['iameric://', 'https://iameric.me'],
    config: {
        screens: {
            Details: 'details',
            ForgotPassword: 'forgot-password',
            Home: '/',
            Signin: 'signin',
            Signup: 'signup',
            ResetPassword: 'reset-password/:token',
        },
    },
}

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <NavigationContainer ref={navigationRef} linking={linking}>
        <ModalProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ModalProvider>
    </NavigationContainer>
)
// apps/web/src/providers/AppProviders.tsx

import { ReactNode } from 'react'
import { AuthProvider, ModalProvider, UserProvider } from '@providers'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <ModalProvider>
        <UserProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </UserProvider>
    </ModalProvider>
)
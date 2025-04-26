// apps/web/src/providers/AppProviders.tsx

import { ReactNode } from 'react'
import { AuthProvider, ModalProvider } from '@providers'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <ModalProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </ModalProvider>
)
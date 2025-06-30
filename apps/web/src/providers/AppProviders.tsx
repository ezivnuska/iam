// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ModalProvider } from '@/providers'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
        <ModalProvider>
            {children}
        </ModalProvider>
    </AuthProvider>
)

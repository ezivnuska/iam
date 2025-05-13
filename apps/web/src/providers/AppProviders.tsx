// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ImageProvider, ModalProvider } from '.'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
        <ModalProvider>
            <ImageProvider>
                {children}
            </ImageProvider>
        </ModalProvider>
    </AuthProvider>
)
// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ImageProvider, ModalProvider } from '.'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
        <ImageProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </ImageProvider>
    </AuthProvider>
)
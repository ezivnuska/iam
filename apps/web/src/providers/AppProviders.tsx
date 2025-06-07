// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ImageProvider, ModalProvider, PostsProvider } from '.'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <ModalProvider>
        <AuthProvider>
            <PostsProvider>
                <ImageProvider>
                    {children}
                </ImageProvider>
            </PostsProvider>
        </AuthProvider>
    </ModalProvider>
)
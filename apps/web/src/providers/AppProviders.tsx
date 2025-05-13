// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ImageProvider, ModalProvider, PostsProvider } from '.'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
        <ImageProvider>
            <ModalProvider>
                <PostsProvider>
                    {children}
                </PostsProvider>
            </ModalProvider>
        </ImageProvider>
    </AuthProvider>
)
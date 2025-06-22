// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ImageProvider, ModalProvider, PostsProvider, SocketProvider } from '.'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <SocketProvider>
        <AuthProvider>
            <ModalProvider>
                <PostsProvider>
                    <ImageProvider>
                        {children}
                    </ImageProvider>
                </PostsProvider>
            </ModalProvider>
        </AuthProvider>
    </SocketProvider>
)
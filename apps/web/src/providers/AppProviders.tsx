// apps/web/src/providers/AppProviders.tsx

import React, { ReactNode } from 'react'
import { AuthProvider, ImageProvider, ModalProvider, PostsProvider, SocketProvider } from '.'

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <SocketProvider>
        <AuthProvider>
            <PostsProvider>
                <ImageProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </ImageProvider>
            </PostsProvider>
        </AuthProvider>
    </SocketProvider>
)
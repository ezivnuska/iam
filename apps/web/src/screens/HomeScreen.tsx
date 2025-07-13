// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { CreatePostButton, ScreenLayout } from '@/components'
import { Feed } from '@/presentations'
import { useAuth } from '@/hooks'

export const HomeScreen = () => {
    const { isAuthenticated } = useAuth()
	return (
        <ScreenLayout nav={isAuthenticated && <CreatePostButton />}>
            <Feed />
        </ScreenLayout>
	)
}

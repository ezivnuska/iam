// apps/web/src/features/feed/screens/FeedScreen.tsx

import React from 'react'
import { ScreenContainer } from '@shared/layout'
import { MemoryViewHeader } from '../components'
import { MemoryNavigator } from '../'

export const MemoryScreen = () => (
    // <MemoryProvider>
        <ScreenContainer
            header={MemoryViewHeader}
            screen={MemoryNavigator}
        />
    // </MemoryProvider>
)


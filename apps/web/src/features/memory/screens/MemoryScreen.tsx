// apps/web/src/features/feed/screens/FeedScreen.tsx

import React, { useEffect, useRef } from 'react'
import { ScreenContainer } from '@shared/layout'
import { MemoryViewHeader } from '..'
import { MemoryNavigator } from '..'
import { useMemory } from '../hooks'
import { LoadingPanel } from '@shared/ui'

export const MemoryScreen = () => {
    const { isInitialized, refreshMemories } = useMemory()
    
    const didMountRef = useRef(false)

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
            refreshMemories()
        }
    }, [])

    if (!isInitialized) {
        return <LoadingPanel label='Loading Memories...' />
    }
	return (
        <ScreenContainer
            header={MemoryViewHeader}
            screen={MemoryNavigator}
        />
	)
}

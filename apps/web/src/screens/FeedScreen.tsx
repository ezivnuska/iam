// apps/web/src/screens/FeedScreen.tsx

import React, { useEffect, useRef } from 'react'
import { FeedViewHeader, ScreenContainer } from '@/components'
import { FeedNavigator } from '@/navigation'
import { usePosts } from '@/hooks'
import { LoadingScreen } from './LoadingScreen'

export const FeedScreen = () => {
    const { isInitialized, refreshPosts } = usePosts()
    
    const didMountRef = useRef(false)

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
            refreshPosts()
        }
    }, [])

    if (!isInitialized) {
        return <LoadingScreen label='Loading Posts...' />
    }
	return (
        <ScreenContainer
            header={FeedViewHeader}
            screen={FeedNavigator}
        />
	)
}

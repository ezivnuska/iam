// apps/web/src/features/feed/screens/FeedScreen.tsx

import React, { useEffect, useRef } from 'react'
import { ScreenContainer } from '@shared/layout'
import { FeedViewHeader } from '../'
import { FeedNavigator } from '../'
import { usePosts } from '../hooks'
import { LoadingPanel } from '@shared/ui'

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
        return <LoadingPanel label='Loading Posts...' />
    }
	return (
        <ScreenContainer
            header={FeedViewHeader}
            screen={FeedNavigator}
        />
	)
}

// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { StyleSheet } from 'react-native'
import { Column, CreatePostButton, PageLayout, PostList } from '@/components'
import { useAuth } from '@/hooks'

export const HomeScreen = () => {

    const [reloadKey, setReloadKey] = React.useState(0)
        
    const { isAuthenticated } = useAuth()

    return (
        <PageLayout>
            <Column>
                {isAuthenticated && (
                    <CreatePostButton onPostCreated={() => setReloadKey((k) => k + 1)} />
                )}
                <PostList key={reloadKey} />
            </Column>
        </PageLayout>
    )
}

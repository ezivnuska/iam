// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { View } from 'react-native'
import { PageLayout, CreatePostButton, PostFeed } from '@/components'
import { useAuth, useScrollHeaderFooterVisibility } from '@/hooks'
import { PostsProvider } from '@/providers'

export const HomeScreen = () => {
	const { isAuthenticated } = useAuth()
	const {
		pageLayoutRef,
		onLayoutTrigger,
		debouncedShowHeaderFooter,
	} = useScrollHeaderFooterVisibility()

	return (
        <PostsProvider>
            <PageLayout>
				{isAuthenticated && <CreatePostButton />}
                <View style={{ flex: 1 }}>
                    <PostFeed
                        onScrollDirectionChange={onLayoutTrigger}
                        onScrolledToTop={debouncedShowHeaderFooter}
                        onScrolledToBottom={debouncedShowHeaderFooter}
                    />
                </View>
            </PageLayout>
        </PostsProvider>
	)
}

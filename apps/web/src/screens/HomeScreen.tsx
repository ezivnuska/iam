// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { AnimatedPageLayout, CreatePostButton, PostFeed } from '@/components'
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
            <AnimatedPageLayout ref={pageLayoutRef}>
				{isAuthenticated && <CreatePostButton />}
				<PostFeed
					onScrollDirectionChange={onLayoutTrigger}
					onScrolledToTop={debouncedShowHeaderFooter}
					onScrolledToBottom={debouncedShowHeaderFooter}
				/>
            </AnimatedPageLayout>
        </PostsProvider>
	)
}

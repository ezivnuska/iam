// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { AnimatedPageLayout, CreatePostButton, PostFeed } from '@/components'
import { useAuth, useScrollHeaderFooterVisibility, useModal } from '@/hooks'
import { PostForm } from '@/forms'
import { PostsProvider } from '@/providers'

export const HomeScreen = () => {
	const { isAuthenticated } = useAuth()
	const { openFormModal, showModal } = useModal()
	const {
		pageLayoutRef,
		onLayoutTrigger,
		debouncedShowHeaderFooter,
	} = useScrollHeaderFooterVisibility()

	const handleOpenPostForm = () => {
		openFormModal(PostForm, {
			onPostCreated: () => {
				// Refresh feed or show toast, etc.
				console.log('Post created from HomeScreen')
			},
		}, { title: 'Create Post', fullscreen: false })
	}

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

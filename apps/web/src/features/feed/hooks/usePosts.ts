// apps/web/src/features/feed/hooks/usePosts.ts

import { useContext } from 'react'
import { PostsContext, PostsContextType } from '@shared/providers'

export const usePosts = (): PostsContextType => {
	const context = useContext(PostsContext)
	if (!context) {
		throw new Error('usePosts must be used within a PostsProvider')
	}
	return context
}
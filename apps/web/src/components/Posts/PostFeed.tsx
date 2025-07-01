// apps/web/src/components/Posts/PostFeed.tsx

import React, { useEffect, useState, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { InfiniteScrollView, PostListItem } from '@/components'
import { usePosts } from '@/hooks'
import type { Post } from '@iam/types'

const PAGE_SIZE = 2

type PostFeedProps = {
	onScrollDirectionChange?: (direction: 'up' | 'down') => void
	onScrolledToTop?: () => void
	onScrolledToBottom?: () => void
}

const PostFeedContent = ({
	onScrollDirectionChange,
	onScrolledToTop,
	onScrolledToBottom,
}: PostFeedProps) => {
	const { posts, commentCounts, setCommentCounts } = usePosts()
	const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
	const [loadingMore, setLoadingMore] = useState(false)

	// Update visiblePosts when posts change
	useEffect(() => {
		setVisiblePosts(posts.slice(0, PAGE_SIZE))
	}, [posts])

	const loadMore = useCallback(() => {
		if (loadingMore || visiblePosts.length >= posts.length) return
		setLoadingMore(true)

		setVisiblePosts((prev) => {
			const next = posts.slice(0, prev.length + PAGE_SIZE)
			return next.length > prev.length ? next : prev
		})

		setLoadingMore(false)
	}, [loadingMore, posts, visiblePosts.length])

	return (
		<InfiniteScrollView
			onScrollNearBottom={loadMore}
			onScrollDirectionChange={onScrollDirectionChange}
			onScrolledToTop={onScrolledToTop}
			onScrolledToBottom={onScrolledToBottom}
		>
			{visiblePosts.map((post) => (
				<PostListItem
					key={post._id}
					post={post}
					showPreview={!!post.linkPreview}
					commentCount={commentCounts[post._id] ?? 0}
					onCommentDeleted={() => {
						setCommentCounts((prev) => ({
							...prev,
							[post._id]: Math.max((prev[post._id] ?? 1) - 1, 0),
						}))
					}}
				/>
			))}
			{loadingMore && (
				<View style={{ paddingVertical: 20, alignItems: 'center' }}>
					<ActivityIndicator size='small' />
				</View>
			)}
		</InfiniteScrollView>
	)
}

export const PostFeed = ({
	onScrollDirectionChange,
	onScrolledToTop,
	onScrolledToBottom,
}: PostFeedProps) => (
    <PostFeedContent
        onScrollDirectionChange={onScrollDirectionChange}
        onScrolledToTop={onScrolledToTop}
        onScrolledToBottom={onScrolledToBottom}
    />
)

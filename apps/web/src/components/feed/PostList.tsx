// apps/web/src/components/feed/PostList.tsx

import React, { useEffect, useState, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Column, InfiniteScrollView, PostListItem } from '@/components'
import { usePosts } from '@/hooks'
import type { Post } from '@iam/types'

const PAGE_SIZE = 3

type PostListProps = {
	onScrollDirectionChange?: (direction: 'up' | 'down') => void
	onScrolledToTop?: () => void
	onScrolledToBottom?: () => void
}

const PostListContent = ({
	onScrollDirectionChange,
	onScrolledToTop,
	onScrolledToBottom,
}: PostListProps) => {
	const { posts } = usePosts()
	const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
	const [loadingMore, setLoadingMore] = useState(false)

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
            <Column>
                {visiblePosts.map((post) => (
                    <PostListItem
                        key={post._id}
                        post={post}
                        showPreview={!!post.linkPreview}
                    />
                ))}
            </Column>
			{loadingMore && (
				<View style={{ paddingVertical: 20, alignItems: 'center' }}>
					<ActivityIndicator size='small' />
				</View>
			)}
		</InfiniteScrollView>
	)
}

export const PostList = ({
	onScrollDirectionChange,
	onScrolledToTop,
	onScrolledToBottom,
}: PostListProps) => (
    <PostListContent
        onScrollDirectionChange={onScrollDirectionChange}
        onScrolledToTop={onScrolledToTop}
        onScrolledToBottom={onScrolledToBottom}
    />
)

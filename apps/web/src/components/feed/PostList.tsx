// apps/web/src/components/feed/PostList.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { InfiniteScrollView, PostListItem, Column } from '@/components'
import { usePosts } from '@/hooks'
import { resolveResponsiveProp } from '@iam/theme'

const PAGE_SIZE = 5

export const PostList = () => {
	const { posts, isRefreshing, isMutating } = usePosts()

	const [visiblePosts, setVisiblePosts] = useState(posts.slice(0, PAGE_SIZE))
    const paddingVertical = resolveResponsiveProp({ xs: 4, sm: 8, md: 16, lg: 24 })

	useEffect(() => {
		setVisiblePosts(posts.slice(0, PAGE_SIZE))
	}, [posts])

	const loadMorePosts = useCallback(() => {
		setVisiblePosts(prev => {
			const next = posts.slice(0, prev.length + PAGE_SIZE)
			return next.length > prev.length ? next : prev
		})
	}, [posts, visiblePosts.length])

	const hasMore = visiblePosts.length < posts.length

	return (
		<InfiniteScrollView onScrollNearBottom={hasMore ? loadMorePosts : undefined}>
			<Column paddingVertical={paddingVertical}>
				{visiblePosts.map((post) => (
					<PostListItem
						key={post._id}
						post={post}
						showPreview={!!post.linkPreview}
					/>
				))}
			</Column>
			{(isRefreshing || isMutating) && (
				<View style={{ paddingVertical: 20, alignItems: 'center' }}>
					<ActivityIndicator size='small' />
				</View>
			)}
		</InfiniteScrollView>
	)
}

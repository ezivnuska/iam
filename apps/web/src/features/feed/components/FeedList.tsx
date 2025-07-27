// apps/web/src/features/feed/components/FeedList.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { FeedListItem } from './'
import { InfiniteScrollView } from '@shared/scrolling'
import { Column } from '@shared/grid'
import { usePosts } from '../hooks'
import { useTheme } from '@shared/hooks'

const PAGE_SIZE = 5

export const FeedList = () => {
	const { posts, isRefreshing, isMutating } = usePosts()
	const { theme } = useTheme()

	const [visiblePosts, setVisiblePosts] = useState(posts.slice(0, PAGE_SIZE))

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
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <InfiniteScrollView onScrollNearBottom={hasMore ? loadMorePosts : undefined}>
                <Column>
                    {visiblePosts.map((post) => (
                        <View key={post.id}>
                            <FeedListItem
                                post={post}
                                showPreview={!!post.linkPreview}
                            />
                        </View>
                    ))}
                </Column>
                {(isRefreshing || isMutating) && (
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <ActivityIndicator size='small' />
                    </View>
                )}
            </InfiniteScrollView>
        </View>
	)
}

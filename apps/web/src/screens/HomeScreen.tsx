// apps/web/src/screens/HomeScreen.tsx

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { InfiniteScrollView, AnimatedPageLayout, PostListItem } from '@/components'
import { usePosts } from '@/hooks'
import type { Post } from '@iam/types'
import type { AnimatedPageLayoutHandles } from '@/components'

const PAGE_SIZE = 2

export const HomeScreen = () => {
	const { posts, refreshPosts, commentCounts, setCommentCounts } = usePosts()
	const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
	const [initialLoading, setInitialLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			setInitialLoading(true)
			await refreshPosts()
			setInitialLoading(false)
		}
		fetchData()
	}, [])

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

    const pageLayoutRef = useRef<AnimatedPageLayoutHandles>(null)

    const onLayoutTrigger = (direction: string) => {
        pageLayoutRef.current?.hideHeaderFooter()
        // Or pageLayoutRef.current?.showHeaderFooter()
		if (direction === 'down') {
			pageLayoutRef.current?.hideHeaderFooter()
		} else {
			pageLayoutRef.current?.showHeaderFooter()
		}
    }

	return (
		<AnimatedPageLayout ref={pageLayoutRef}>
			{initialLoading ? (
				<View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
					<ActivityIndicator size='large' />
				</View>
			) : (
				<InfiniteScrollView
                    onScrollNearBottom={loadMore}
                    onScrollDirectionChange={(direction) => {
						onLayoutTrigger(direction)
                        
                    }}
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
			)}
		</AnimatedPageLayout>
	)
}

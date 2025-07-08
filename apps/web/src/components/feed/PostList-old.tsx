// apps/web/src/components/PostList.tsx

import React, { useState, useCallback, useEffect } from 'react'
import { ScrollView, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import type { Post } from '@iam/types'
import { PostListItem } from '@/components'
import { usePosts } from '@/hooks'
import { Size } from '@/styles'

const PAGE_SIZE = 10

export const PostList = () => {
	const { commentCounts, setCommentCounts, posts, refreshPosts } = usePosts()
	const [visiblePosts, setVisiblePosts] = useState<Post[]>([])

	useEffect(() => {
		refreshPosts()
	}, [])
	useEffect(() => {
		console.log('visiblePosts', visiblePosts)
	}, [visiblePosts])
	useEffect(() => {
		console.log('posts', posts)
		setVisiblePosts(posts.slice(0, PAGE_SIZE))
	}, [posts])

	const loadMore = useCallback(() => {
		const next = posts.slice(0, visiblePosts.length + PAGE_SIZE)
		if (next.length > visiblePosts.length) {
			setVisiblePosts(next)
		}
	}, [posts, visiblePosts])

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
		const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height)

		if (distanceFromBottom < 100) {
			loadMore()
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				onScroll={handleScroll}
				scrollEventThrottle={16}
				style={{ flex: 1, backgroundColor: 'red' }}
				contentContainerStyle={{
					paddingVertical: Size.S,
				}}
				showsVerticalScrollIndicator={false}
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
			</ScrollView>
		</View>
	)
}

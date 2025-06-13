// apps/web/src/components/PostList.tsx

import React, { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import type { ListRenderItemInfo } from 'react-native'
import { usePosts, useModal } from '@/hooks'
import { PostListItem } from '@/components'
import { Post } from '@iam/types'
import { Size } from '@/styles'

export const PostList = () => {
	const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

	const { commentCounts, setCommentCounts } = usePosts()
	const { posts, deletePost, refreshPosts } = usePosts()
	const { showModal } = useModal()

	useEffect(() => {
		refreshPosts()
	}, [])

	const renderItem = useCallback(
		({ item }: ListRenderItemInfo<Post>) => {
			return (
				<PostListItem
					post={item}
					showPreview={!!item.linkPreview}
					commentCount={commentCounts[item._id] ?? 0}
					onCommentDeleted={() => {
						setCommentCounts((prev) => ({
							...prev,
							[item._id]: Math.max((prev[item._id] ?? 1) - 1, 0),
						}))
					}}
				/>
			)
		},
		[commentCounts]
	)

	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item._id}
			initialNumToRender={2}
			maxToRenderPerBatch={3}
			windowSize={4}
			removeClippedSubviews={true}
			contentContainerStyle={{ paddingVertical: Size.S }}
			renderItem={renderItem}
		/>
	)
}

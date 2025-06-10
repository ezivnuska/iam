// apps/web/src/components/PostList.tsx

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, ViewToken } from 'react-native'
import type { ListRenderItemInfo } from 'react-native'
import { useAuth, useLinkPreviewQueue, useModal, usePosts } from '@/hooks'
import { PostListItem } from '@/components'
import { Post } from '@iam/types'
import { fetchCommentSummary } from '@services'
import { Size } from '@/styles'
import { extractFirstUrl } from '@/utils'

export const PostList = () => {
	const [loadedLinkIds, setLoadedLinkIds] = useState<Set<string>>(new Set())
	const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

	const { commentCounts, setCommentCounts } = usePosts()
	const { posts, deletePost, refreshPosts } = usePosts()
	const { showModal } = useModal()

	useEffect(() => {
		refreshPosts()
	}, [])

	const { shouldRender, enqueue } = useLinkPreviewQueue(2)

	const MAX_NEW_LINKS_PER_PASS = 2

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
			setLoadedLinkIds((prev) => {
				const updated = new Set(prev)
				let newlyAdded = 0

				for (const { item } of viewableItems) {
					const post = item as Post
					const firstUrl = extractFirstUrl(post.content)
					if (
						firstUrl &&
						!updated.has(post._id) &&
						newlyAdded < MAX_NEW_LINKS_PER_PASS
					) {
						updated.add(post._id)
						newlyAdded++
						enqueue(post._id, firstUrl, () => {})
					}
				}

				return updated
			})
		},
		[enqueue]
	)

	const viewabilityConfig = {
		itemVisiblePercentThreshold: 30,
		minimumViewTime: 100,
	}

	const viewabilityCallbackPairs = useRef([
		{ viewabilityConfig, onViewableItemsChanged },
	])

	const renderItem = useCallback(
		({ item }: ListRenderItemInfo<Post>) => {
			const firstUrl = extractFirstUrl(item.content)

			return (
				<PostListItem
					post={item}
					firstUrl={firstUrl}
					showPreview={shouldRender(item._id)}
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
		[shouldRender, commentCounts]
	)

	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item._id}
			initialNumToRender={2}
			maxToRenderPerBatch={3}
			windowSize={4}
			removeClippedSubviews={true}
			viewabilityConfigCallbackPairs={viewabilityCallbackPairs.current}
			contentContainerStyle={{ paddingVertical: Size.S }}
			renderItem={renderItem}
		/>
	)
}

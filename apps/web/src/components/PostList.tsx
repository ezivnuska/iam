// apps/web/src/components/PostList.tsx

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, ViewToken } from 'react-native'
import type { ListRenderItemInfo } from 'react-native'
import { useAuth, useLinkPreviewQueue, useModal, usePosts } from '@/hooks'
import { AddCommentForm, Column, CommentSection, PostListItem, ProfileImage, Row, QueuedLinkPreview } from '@/components'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Comment, PartialUser, Post } from '@iam/types'
import { fetchCommentSummary, fetchComments, toggleLike } from '@services'
import { Size } from '@/styles'
import { extractFirstUrl } from '@/utils'
import { formatRelative } from 'date-fns'

export const PostList = () => {

	const [loadedLinkIds, setLoadedLinkIds] = useState<Set<string>>(new Set())
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

	const { isAuthenticated, user } = useAuth()
	const { showModal } = useModal()
	const { posts, deletePost, refreshPosts } = usePosts()

	useEffect(() => {
		refreshPosts()
	}, [])

    useEffect(() => {
        const fetchCounts = async () => {
            const counts: Record<string, number> = {}
            const commentIdMap: Record<string, string[]> = {}
        
            await Promise.all(posts.map(async (post) => {
                try {
                    const summary = await fetchCommentSummary(post._id)
                    counts[post._id] = summary.count
                    commentIdMap[post._id] = summary.commentIds
                } catch (err) {
                    console.error('Failed to load comment summary:', err)
                }
            }))
        
            setCommentCounts(counts)
        }
        fetchCounts()
    }, [posts])      

    const { shouldRender, enqueue } = useLinkPreviewQueue(2)

    const toggleComments = (postId: string) => {
        setExpandedComments((prev) => {
            const next = new Set(prev)
            if (next.has(postId)) {
                next.delete(postId)
            } else {
                next.add(postId)
            }
            return next
        })
    }

	const MAX_NEW_LINKS_PER_PASS = 2

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        setLoadedLinkIds((prev) => {
            const updated = new Set(prev)
            let newlyAdded = 0
    
            for (const { item } of viewableItems) {
                const post = item as Post
                const firstUrl = extractFirstUrl(post.content)
                if (firstUrl && newlyAdded < MAX_NEW_LINKS_PER_PASS && !updated.has(post._id)) {
                    updated.add(post._id)
                    newlyAdded++
    
                    enqueue(post._id, firstUrl, () => {
                        // Optional: mark completed
                    })
                }
            }
    
            return updated
        })
    }, [enqueue])
    
	const viewabilityConfig = {
        itemVisiblePercentThreshold: 30,
        minimumViewTime: 100,
    }
    
    const viewabilityCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged }
    ])

    const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => {
        const firstUrl = extractFirstUrl(item.content)
    
        return (
            <PostListItem
                post={item}
                firstUrl={firstUrl}
                shouldRender={shouldRender}
                enqueue={enqueue}
            />
        )
    }, [shouldRender, enqueue])
    

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
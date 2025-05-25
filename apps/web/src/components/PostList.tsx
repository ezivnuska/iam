// apps/web/src/components/PostList.tsx

import React, { useState } from 'react'
import { FlatList, Pressable, Text, ViewToken } from 'react-native'
import { useAuth, useModal, usePosts } from '@/hooks'
import { AddCommentForm, Column, CommentSection, LinkPreview, ProfileImage, Row } from '@/components'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Comment, PartialUser, Post } from '@iam/types'
import { fetchComments, toggleLike } from '@services'
import {  } from '@services'
import { Size } from '@/styles'
import Autolink from 'react-native-autolink'
import { formatRelative } from 'date-fns'
import { useEffect, useRef } from 'react'

export const PostList = () => {

	const [loadedLinkIds, setLoadedLinkIds] = useState<Set<string>>(new Set())
    const [commentsByPostId, setCommentsByPostId] = useState<Record<string, Comment[]>>({})

	const { isAuthenticated, user } = useAuth()
	const { showModal } = useModal()
	const { posts, deletePost, refreshPosts } = usePosts()

	useEffect(() => {
		refreshPosts()
	}, [])

	const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
            setLoadedLinkIds((prev) => {
                const updated = new Set(prev)
                viewableItems.forEach(({ item }) => {
                    const post = item as Post
                    updated.add(post._id)
    
                    if (!commentsByPostId[post._id]) {
                        loadComments(post._id)
                    }
                })
                return updated
            })
        }
    ).current    

	const extractFirstUrl = (text: string): string | null => {
        const urlRegex = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi
        const match = text.match(urlRegex)
        if (!match) return null
    
        let url = match[0]
    
        if (!url.startsWith('http')) {
            url = 'https://' + url
        }
    
        return url
    }    
    
	// posible fix for non-rendering items
	// const viewabilityConfig = { itemVisiblePercentThreshold: 50 }
	// const viewabilityCallbackPair = useRef([
	// 	{ viewabilityConfig, onViewableItemsChanged }
	// ]).current

    const onToggleLike = async (postId: string) => {
        await toggleLike(postId)
        await refreshPosts()
    }

    const loadComments = async (postId: string) => {
        const data = await fetchComments(postId)
        setCommentsByPostId(prev => ({ ...prev, [postId]: data }))
    }    

    const openCommentForm = (postId: string) =>
        showModal(<AddCommentForm postId={postId} onCommentAdded={() => loadComments(postId)} />)    

	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item._id}
			onViewableItemsChanged={onViewableItemsChanged}
			viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
			// viewabilityConfigCallbackPairs={viewabilityCallbackPair}
			initialNumToRender={5}
            contentContainerStyle={{ paddingVertical: Size.S }}
			renderItem={({ item }) => {
				const firstUrl = extractFirstUrl(item.content)
                const liked = item.likedByCurrentUser
                const likeCount = item.likes.length
				return (
					<Column flex={1} spacing={Size.M} paddingBottom={Size.L}>
						{renderHeader(item)}
						<Autolink
							text={item.content}
							linkStyle={{ color: '#007aff' }}
							url
							email={false}
							phone={false}
							truncate={50}
							truncateChars='...'
							style={{ paddingHorizontal: Size.M }}
						/>
						{loadedLinkIds.has(item._id) && firstUrl && (
							<LinkPreview url={firstUrl} />
						)}
                        <Row paddingHorizontal={Size.M} spacing={8}>
                            <Row spacing={8}>
                                <Text>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</Text>
                                {isAuthenticated && (
                                    <Pressable onPress={() => onToggleLike(item._id)}>
                                        <Text style={{ fontSize: 16, color: liked ? 'red' : 'gray' }}>{liked ? '♥' : '♡'}</Text>
                                    </Pressable>
                                )}
                            </Row>
                            {isAuthenticated && (
                                <Pressable onPress={() => openCommentForm(item._id)}>
                                    <Text>Add Comment</Text>
                                </Pressable>
                            )}
                        </Row>
                        {loadedLinkIds.has(item._id) && (
                            <CommentSection comments={commentsByPostId[item._id] ?? []} />
                        )}
					</Column>
				)
			}}
		/>
	)

	function renderHeader(item: Post) {
		const isAuthor = user?.id === item.author._id
		return (
			<Row spacing={16} paddingHorizontal={Size.M} align='center'>
				<ProfileImage user={item.author as PartialUser} size='md' />
				<Column flex={1}>
					<Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 22 }}>
						{item.author.username}
					</Text>
					<Text style={{ fontSize: 14, lineHeight: 16 }}>
						{formatRelative(new Date(item.createdAt), new Date())}
					</Text>
				</Column>
				{isAuthor && (
					<Pressable onPress={() => deletePost(item._id)} style={{ alignSelf: 'flex-start' }}>
						<Ionicons name='close-sharp' size={24} color='black' />
					</Pressable>
				)}
			</Row>
		)
	}
}

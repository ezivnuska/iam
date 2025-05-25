// apps/web/src/components/PostList.tsx

import React, { useState } from 'react'
import { FlatList, Pressable, Text, ViewToken } from 'react-native'
import { useAuth, usePosts } from '@/hooks'
import { Column, ProfileImage, RenderedLink, Row } from '@/components'
import Ionicons from '@expo/vector-icons/Ionicons'
import { PartialUser, Post } from '@iam/types'
import { Size } from '@/styles'
import Autolink from 'react-native-autolink'
import { formatRelative } from 'date-fns'
import { useEffect, useRef } from 'react'

export const PostList = () => {

	const [loadedLinkIds, setLoadedLinkIds] = useState<Set<string>>(new Set())

	const { user } = useAuth()
	const { posts, deletePost, refreshPosts } = usePosts()

	useEffect(() => {
		refreshPosts()
	}, [])

	const onViewableItemsChanged = useRef(
		({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
			setLoadedLinkIds((prev) => {
				const updated = new Set(prev)
				viewableItems.forEach(({ item }) => {
					updated.add((item as Post)._id)
				})
				return updated
			})
		}
	).current	

	const extractFirstUrl = (text: string): string | null => {
        const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}(\/\S*)?/g
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

	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item._id}
			onViewableItemsChanged={onViewableItemsChanged}
			viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
			// viewabilityConfigCallbackPairs={viewabilityCallbackPair}
			initialNumToRender={5}
			renderItem={({ item }) => {
				const firstUrl = extractFirstUrl(item.content)
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
							<RenderedLink url={firstUrl} />
						)}
					</Column>
				)
			}}
		/>
	)

	function renderHeader(item: Post) {
		const isAuthor = user?.id === item.user._id
		return (
			<Row spacing={16} paddingHorizontal={Size.M} align='center'>
				<ProfileImage user={item.user as PartialUser} size='md' />
				<Column flex={1} spacing={2}>
					<Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 22 }}>
						{item.user.username}
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

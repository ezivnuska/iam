// apps/web/src/components/PostList.tsx

import React, { useEffect } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { useAuth, usePosts } from '@/hooks'
import { Column, RenderedLink, ProfileImage, Row } from '@/components'
import Ionicons from '@expo/vector-icons/Ionicons'
import { PartialUser } from '@iam/types'
import { Size } from '@/styles'
import Autolink from 'react-native-autolink'

export const PostList = () => {
	const { user } = useAuth()
	const { posts, deletePost, refreshPosts } = usePosts()
    useEffect(() => {
        refreshPosts()
    }, [])
	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item._id}
			renderItem={({ item }) => {
                const isAuthor = user?.id === item.user._id
                return (
                    <Row spacing={10} paddingHorizontal={Size.M} align='flex-start'>
                        {item.user && (
                            <View style={{ alignSelf: 'flex-start' }}>
                                <ProfileImage user={item.user as PartialUser} size='xs' />
                            </View>
                        )}
                        <Column flex={1} spacing={10} paddingBottom={10}>
                            <Text style={{ fontWeight: 'bold', lineHeight: 24 }}>{item.user.username}</Text>
                            <Autolink
                                text={item.content}
                                component={View}
                                renderLink={(text, match) => <RenderedLink url={match.getAnchorHref()} />}
                            />
                        </Column>
                        {isAuthor && (
                            <Pressable onPress={() => deletePost(item._id)} style={{ alignSelf: 'flex-start' }}>
                                <Ionicons name='close-sharp' size={18} color='black' />
                            </Pressable>
                        )}
                    </Row>
                )
            }}
		/>
	)
}
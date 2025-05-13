// apps/web/src/components/PostList.tsx

import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { usePosts } from '@/hooks'

export const PostList = () => {
	const { posts } = usePosts()

	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item._id}
			renderItem={({ item }) => (
                <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.user.username}</Text>
                    <Text>{item.content}</Text>
                </View>
            )}
		/>
	)
}
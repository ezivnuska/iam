// screens/FeedScreen.tsx

import React from 'react'
import { View } from 'react-native'
import { CreatePostForm } from '@/components/forms'
import { PostList } from '@/components'

export const FeedScreen = () => {
	const [reloadKey, setReloadKey] = React.useState(0)

	return (
		<View style={{ padding: 20 }}>
			<CreatePostForm onPostCreated={() => setReloadKey((k) => k + 1)} />
			<PostList key={reloadKey} />
		</View>
	)
}
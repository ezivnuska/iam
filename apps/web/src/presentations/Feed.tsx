// apps/web/src/presentations/Feed.tsx

import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { CreatePostButton, PostList, Spinner } from '@/components'
import { useAuth, usePosts } from '@/hooks'

export const Feed = () => {
	const { isAuthenticated } = useAuth()
	const { isInitialized, refreshPosts } = usePosts()

	const didMountRef = useRef(false)

	useEffect(() => {
		if (!didMountRef.current) {
			didMountRef.current = true
			refreshPosts()
		}
	}, [])

	if (!isInitialized) {
		return <Spinner label='Loading Posts...' />
	}

	return (
		<>
			{isAuthenticated && <CreatePostButton />}
			<View style={{ flex: 1 }}>
				<PostList />
			</View>
		</>
	)
}

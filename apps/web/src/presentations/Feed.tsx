// apps/web/src/presentations/Feed.tsx

import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Column, CreatePostButton, PostList, Spinner } from '@/components'
import { useAuth, usePosts } from '@/hooks'
import { Size } from '@iam/theme'

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
		<Column spacing={Size.M}>
			{isAuthenticated && (
                <View style={{ alignSelf: 'flex-start' }}>
                    <CreatePostButton />
                </View>
            )}
			<View style={{ flex: 1 }}>
				<PostList />
			</View>
		</Column>
	)
}

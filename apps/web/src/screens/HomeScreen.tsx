// packages/screens/src/screens/HomeScreen.tsx

import React, { useState } from 'react'
import { PageHeader, PageLayout } from '../components'
import { CreatePostForm, PostList } from '@/components'
import { useAuth } from '../hooks'

export const HomeScreen = () => {
    const { user, isAuthenticated } = useAuth()

	return (
		<PageLayout>
			<PageHeader title={`Home${isAuthenticated ? `: ${user?.username}` : ''}`} />
            <CreatePostForm />
            <PostList />
		</PageLayout>
	)
}
// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { useModal, usePosts } from'@/hooks'
import { Button, PostForm } from '@/components'
import type { Post } from '@iam/types'

export const CreatePostButton = () => {
	const { hideModal, openFormModal } = useModal()
	const { addPost } = usePosts()

	const onPostCreated = (post: Post) => {
		console.log('adding post', post)
		addPost(post)
		hideModal()
	}

	const showPostModal = () => {
		openFormModal(PostForm, { onPostCreated }, { title: 'Create Post' })
	}

	return (
        <Button
            label='New Post'
            onPress={showPostModal}
            variant='primary'
        />
    )
}

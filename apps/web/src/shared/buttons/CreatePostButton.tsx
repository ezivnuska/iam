// apps/web/src/shared/buttons/CreatePostButton.tsx

import React from 'react'
import { useModal } from'@shared/hooks'
import { usePosts } from'@features/feed'
import { Button } from '@shared/buttons'
import { PostForm } from '@shared/forms'
import type { Post } from '@iam/types'

export const CreatePostButton = () => {
	const { hideModal, openFormModal } = useModal()
	const { addPost } = usePosts()

	const onPostCreated = (post: Post) => {
		addPost(post)
		hideModal()
	}

	const showPostModal = () => {
		openFormModal(PostForm, { onPostCreated }, { title: 'Create Post', fullscreen: true })
	}

	return (
        <Button
            label='New Post'
            onPress={showPostModal}
            variant='primary'
            compact
        />
    )
}

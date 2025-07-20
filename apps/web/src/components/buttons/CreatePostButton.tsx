// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { Pressable } from 'react-native'
import { useDeviceInfo, useModal, usePosts, useTheme } from'@/hooks'
import { Button, PostForm, Row } from '@/components'
import type { Post } from '@iam/types'
import Ionicons from '@expo/vector-icons/Ionicons'

export const CreatePostButton = () => {
	const { hideModal, openFormModal } = useModal()
	const { addPost } = usePosts()
    const { theme } = useTheme()
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'

	const onPostCreated = (post: Post) => {
		console.log('adding post', post)
		addPost(post)
		hideModal()
	}

	const showPostModal = () => {
		openFormModal(PostForm, { onPostCreated }, { title: 'Create Post' })
	}

	return isLandscape ? (
        <Button
            label='New Post'
            onPress={showPostModal}
            variant='primary'
        />
    ) : (
        <Pressable
            onPress={showPostModal}
        >
            <Row
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    overflow: 'hidden',
                    backgroundColor: theme.colors.primary,
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons
                    name='add'
                    size={32}
                    color={theme.colors.tertiary}
                />
            </Row>
        </Pressable>
    )
}

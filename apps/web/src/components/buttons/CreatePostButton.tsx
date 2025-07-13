// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { useDeviceInfo, useModal, usePosts, useTheme } from'@/hooks'
import { Button, IconButton, PostForm } from '@/components'
import type { Post } from '@iam/types'
import { form as formStyles, Size, paddingHorizontal } from '@iam/theme'
import Ionicons from '@expo/vector-icons/Ionicons'

export const CreatePostButton = () => {
	const { hideModal, showModal, openFormModal } = useModal()
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
            style={{ padding: 3, borderRadius: '50%', backgroundColor: theme.colors.primary }}
        >
            <Ionicons
                name='add'
                size={24}
                color={theme.colors.tertiary}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
	// button: {
	// 	backgroundColor: '#0f0',
	// 	borderRadius: 8,
	// 	alignItems: 'center',
	// },
	text: {
        color: '#000',
		fontWeight: 'bold',
	},
    container: {
		backgroundColor: 'transparent',
        marginVertical: Size.XS,
    },
    createPostButton: {
        color: '#aaa',
        fontSize: 20,
    },
})
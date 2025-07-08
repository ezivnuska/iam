// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { useModal, usePosts } from'@/hooks'
import { PostForm } from '@/components'
import type { Post } from '@iam/types'
import { form as formStyles, Size, paddingHorizontal } from '@/styles'

export const CreatePostButton = () => {
	const { hideModal, showModal, openFormModal } = useModal()
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
		<Pressable style={styles.container} onPress={showPostModal}>
            <Text style={[formStyles.input, styles.createPostButton]}>
                Create Post
            </Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#0f0',
		borderRadius: 8,
		alignItems: 'center',
	},
	text: {
        color: '#000',
		fontWeight: 'bold',
	},
    container: {
		backgroundColor: 'transparent',
        marginVertical: Size.XS,
        paddingHorizontal: paddingHorizontal,
    },
    createPostButton: {
        color: '#aaa',
        fontSize: 20,
    },
})
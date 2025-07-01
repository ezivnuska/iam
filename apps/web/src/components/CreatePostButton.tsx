// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { useModal, usePosts } from'@/hooks'
import { PostForm } from '@/forms'
import type { Post } from '@iam/types'

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
		<Pressable style={styles.button} onPress={showPostModal}>
			<Text style={styles.text}>Create Post</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#0f0',
		padding: 12,
		borderRadius: 8,
		margin: 16,
		alignItems: 'center',
	},
	text: {
		color: '#000',
		fontWeight: 'bold',
	},
})

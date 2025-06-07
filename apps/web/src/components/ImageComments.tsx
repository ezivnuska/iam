// apps/web/src/components/ImageComments.tsx

import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { deleteComment, fetchComments } from '@services'
import { useAuth } from '@/hooks'
import { Size } from '@/styles'
import { CommentItem } from './'
import type { Comment } from '@iam/types'

type ImageCommentsProps = {
	refId: string
	onCommentDeleted?: () => void
}

export const ImageComments = ({ refId, onCommentDeleted }: ImageCommentsProps) => {
	const [comments, setComments] = useState<Comment[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [deletingIds, setDeletingIds] = useState<string[]>([])

	const { user } = useAuth()

	useEffect(() => {
		const loadComments = async () => {
			setLoading(true)
			try {
				const data = await fetchComments(refId, 'Image')
				setComments(data)
			} catch (err) {
				console.error('Failed to load image comments:', err)
			} finally {
				setLoading(false)
			}
		}

		loadComments()
	}, [refId])

	const handleDelete = async (id: string) => {
		setDeletingIds((prev) => [...prev, id])
		try {
			await deleteComment(id)
			setComments((prev) => prev?.filter((c) => c._id !== id) || null)
			onCommentDeleted?.()
		} catch (err) {
			console.error('Failed to delete comment:', err)
		} finally {
			setDeletingIds((prev) => prev.filter((delId) => delId !== id))
		}
	}

	if (loading) {
		return (
			<View style={{ padding: Size.M }}>
				<ActivityIndicator size="small" />
			</View>
		)
	}

	return (
		<FlatList
			data={comments}
			keyExtractor={(item) => item._id}
			renderItem={({ item }) => (
				<CommentItem
					comment={item}
					isAuthor={user?.id === item.author._id}
					isDeleting={deletingIds.includes(item._id)}
					onDelete={handleDelete}
					textColor="#fff"
				/>
			)}
		/>
	)
}

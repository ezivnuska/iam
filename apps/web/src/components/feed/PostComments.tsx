// apps/web/src/components/feed/PostComments.tsx

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { CommentItem } from '@/components'
import { useAuth } from '@/hooks'
import { fetchComments, deleteComment } from '@services'
import type { Comment } from '@iam/types'
import { Size } from '@/styles'

type PostCommentsProps = {
	refId: string
	onCommentDeleted?: () => void
    onCommentAdded?: () => void
}

export const PostComments = forwardRef(({ refId, onCommentAdded, onCommentDeleted }: PostCommentsProps, ref) => {
	const [comments, setComments] = useState<Comment[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [deletingIds, setDeletingIds] = useState<string[]>([])

    const { user } = useAuth()

    useImperativeHandle(ref, () => ({
		handleNewComment,
	}))

	useEffect(() => {
		refreshComments()
	}, [refId])

    const refreshComments = async () => {
		setLoading(true)
		try {
			const data = await fetchComments(refId, 'Post')
			setComments(data)
		} catch (err) {
			console.error('Failed to refresh comments:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleNewComment = (newComment: Comment) => {
		setComments((prev) => prev ? [newComment, ...prev] : [newComment])
		onCommentAdded?.()
	}

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
				<ActivityIndicator size='small' />
			</View>
		)
	}

	return (
		<FlatList
			data={comments}
			keyExtractor={(item) => item._id}
			renderItem={({ item }) => {
                const isDeleting = deletingIds.includes(item._id)
                const isAuthor = user?.id === item.author._id
                return (
                    <CommentItem
                        comment={item}
                        isAuthor={isAuthor}
                        isDeleting={isDeleting}
                        onDelete={handleDelete}
                        textColor='#eee'
                    />
                )
            }}
		/>
	)
})

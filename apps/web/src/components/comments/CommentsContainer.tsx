// apps/web/src/components/comments/CommentsContainer.tsx

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { deleteComment, fetchComments } from '@services'
import { useAuth } from '@/hooks'
import type { Comment, CommentRefType } from '@iam/types'
import { CommentsList } from '.'

type CommentsContainerProps = {
	refId: string
	refType: CommentRefType
	onCommentDeleted?: () => void
	onCommentAdded?: () => void
	textColor?: string
}

export const CommentsContainer = forwardRef(
	(
		{
			refId,
			refType,
			onCommentDeleted,
			onCommentAdded,
			textColor = '#fff',
		}: CommentsContainerProps,
		ref
	) => {
		const [comments, setComments] = useState<Comment[] | null>(null)
		const [loading, setLoading] = useState(true)
		const [deletingIds, setDeletingIds] = useState<string[]>([])
		const { user } = useAuth()

		useEffect(() => {
			refreshComments()
		}, [refId])

		useImperativeHandle(ref, () => ({
			handleNewComment,
		}))

		const refreshComments = async () => {
			setLoading(true)
			try {
				const data = await fetchComments(refId, refType)
				setComments(data)
			} catch (err) {
				console.error('Failed to load comments:', err)
			} finally {
				setLoading(false)
			}
		}

		const handleNewComment = (newComment: Comment) => {
			setComments((prev) => (prev ? [newComment, ...prev] : [newComment]))
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

		return (
			<CommentsList
				comments={comments}
				isLoading={loading}
				deletingIds={deletingIds}
				currentUserId={user?.id}
				onDelete={handleDelete}
				textColor={textColor}
			/>
		)
	}
)

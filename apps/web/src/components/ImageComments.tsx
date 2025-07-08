// apps/web/src/components/ImageComments.tsx

import React, { useEffect, useState } from 'react'
import { View, ScrollView, useWindowDimensions } from 'react-native'
import { deleteComment, fetchComments } from '@services'
import { useAuth } from '@/hooks'
import { Size } from '@/styles'
import { CommentItem, Spinner } from '@/components'
import type { Comment } from '@iam/types'
import { normalizeUser } from '@utils'

type ImageCommentsProps = {
	refId: string
	onCommentDeleted?: () => void
}

export const ImageComments = ({ refId, onCommentDeleted }: ImageCommentsProps) => {
	const [comments, setComments] = useState<Comment[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [deletingIds, setDeletingIds] = useState<string[]>([])
	const { user } = useAuth()
	const { height } = useWindowDimensions()

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

	return (
		<View style={{ maxHeight: height * 0.4 }}>
			{loading ? (
				<Spinner size={25} />
			) : (
				<ScrollView
					style={{ flex: 1, maxHeight: height * 0.4 }}
					contentContainerStyle={{ paddingBottom: Size.S }}
                    showsVerticalScrollIndicator={false}
				>
					{comments?.map((item: Comment) => {
                        const author = normalizeUser(item.author)
                        return (
                            <CommentItem
                                key={item._id}
                                comment={item}
                                isAuthor={user?.id === author.id}
                                isDeleting={deletingIds.includes(item._id)}
                                onDelete={handleDelete}
                                textColor='#fff'
                            />
                        )
                    })}
				</ScrollView>
			)}
		</View>
	)
}

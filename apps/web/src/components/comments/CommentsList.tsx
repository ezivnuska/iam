// apps/web/src/components/comments/CommentsList.tsx

import React from 'react'
import { View, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native'
import { CommentItem } from '@/components'
import type { Comment } from '@iam/types'
import { normalizeUser } from '@utils'
import { Size } from '@/styles'

type CommentsListProps = {
	comments: Comment[] | null
	deletingIds: string[]
	currentUserId?: string
	onDelete: (id: string) => void
	isLoading?: boolean
	textColor?: string
}

export const CommentsList = ({
	comments,
	deletingIds,
	currentUserId,
	onDelete,
	isLoading,
	textColor = '#fff',
}: CommentsListProps) => {
	const { height } = useWindowDimensions()

	if (isLoading) {
		return (
			<View style={{ padding: Size.M }}>
				<ActivityIndicator size="small" />
			</View>
		)
	}

	return (
		<ScrollView
			style={{ maxHeight: height * 0.4 }}
			contentContainerStyle={{ paddingBottom: Size.S }}
			showsVerticalScrollIndicator={false}
		>
			{comments?.map((item) => {
				const author = normalizeUser(item.author)
				return (
					<CommentItem
						key={item._id}
						comment={item}
						isAuthor={currentUserId === author.id}
						isDeleting={deletingIds.includes(item._id)}
						onDelete={onDelete}
						textColor={textColor}
					/>
				)
			})}
		</ScrollView>
	)
}

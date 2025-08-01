// apps/web/src/shared/feedback/CommentsList.tsx

import React from 'react'
import { View, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native'
import { CommentItem } from './'
import type { Comment } from '@iam/types'
import { Size } from '@iam/theme'

type CommentsListProps = {
	comments: Comment[] | null
	deletingIds: string[]
	currentUserId?: string
	onDelete: (id: string) => void
	isLoading?: boolean
}

export const CommentsList = ({
	comments,
	deletingIds,
	currentUserId,
	onDelete,
	isLoading,
}: CommentsListProps) => {
	const { height } = useWindowDimensions()

	if (isLoading) {
		return (
			<View style={{ padding: Size.M }}>
				<ActivityIndicator size='small' />
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
				return (
                    <View key={item._id}>
                        <CommentItem
                            comment={item}
                            isAuthor={currentUserId === item.author.id}
                            isDeleting={deletingIds.includes(item._id)}
                            onDelete={onDelete}
                        />
                    </View>
				)
			})}
		</ScrollView>
	)
}

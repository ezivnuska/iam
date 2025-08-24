// apps/web/src/shared/feedback/CommentsList.tsx

import React from 'react'
import { View, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native'
import { CommentItem } from '.'
import type { Comment, CommentRefType } from '@iam/types'
import { Size } from '@iam/theme'
import { Column } from '..'
import { CommentForm } from './CommentForm'

type CommentsListProps = {
    refId: string
    refType: CommentRefType
	comments: Comment[] | null
	deletingIds: string[]
	currentUserId?: string
	onDelete: (id: string) => void
	isLoading?: boolean
    onComment: (comment: Comment) => void
}

export const CommentsList = ({
    refId,
    refType,
	comments,
	deletingIds,
	currentUserId,
	isLoading,
	onComment,
	onDelete,
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
        <Column flex={1} spacing={12}>
            <ScrollView
                style={{ maxHeight: height * 0.4 }}
                contentContainerStyle={{ paddingBottom: Size.S }}
                showsVerticalScrollIndicator={false}
            >
                {comments?.map((item, index) => (
                    <View key={`comment-${item.id}-${index}`}>
                        <CommentItem
                            comment={item}
                            isAuthor={currentUserId === item.author.id}
                            isDeleting={deletingIds.includes(item.id)}
                            onDelete={() => onDelete(item.id)}
                        />
                    </View>
                ))}
            </ScrollView>
            <CommentForm id={refId} type={refType} onComment={onComment} />
        </Column>
	)
}

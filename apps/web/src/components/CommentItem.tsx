// apps/web/src/components/CommentItem.tsx

import React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Comment } from '@iam/types'
import { Column, Row } from './Layout'
import { Size } from '@/styles'

type CommentItemProps = {
	comment: Comment
	isAuthor: boolean
	isDeleting: boolean
	onDelete: (id: string) => void
	textColor?: string
	authorTextWeight?: string | number
	paddingBottom?: number
}

export const CommentItem = ({
	comment,
	isAuthor,
	isDeleting,
	onDelete,
	textColor = '#000',
	authorTextWeight = '700',
	paddingBottom = Size.S,
}: CommentItemProps) => {
	return (
		<Row
			spacing={Size.S}
			paddingHorizontal={Size.M}
			paddingBottom={paddingBottom}
			align='flex-start'
			style={{ opacity: isDeleting ? 0.5 : 1 }}
		>
			<Column flex={1} spacing={Size.XS}>
				<Text style={[styles.author, { color: textColor, fontWeight: authorTextWeight as any }]}>
					{comment.author.username}
				</Text>
				<Text style={[styles.text, { color: textColor }]}>{comment.content}</Text>
			</Column>
			{isAuthor && (
				<Pressable onPress={() => onDelete(comment._id)} disabled={isDeleting}>
					<Ionicons name='trash-bin' size={20} color={textColor} />
				</Pressable>
			)}
		</Row>
	)
}

const styles = StyleSheet.create({
	author: {
		fontWeight: '700',
	},
	text: {},
})

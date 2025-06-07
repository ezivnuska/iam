// apps/web/src/components/LikeCommentBar.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Row } from '@/components'
import { Size } from '@/styles'

type Props = {
	likeCount: number
	liked: boolean
	commentCount: number
	expanded?: boolean
	isAuthenticated: boolean
	onToggleLike: () => void
	onToggleComments: () => void
	onAddComment: () => void
	textColor?: string
	iconColor?: string
	disabledComment?: boolean
}

export const LikeCommentBar: React.FC<Props> = ({
	likeCount,
	liked,
	commentCount,
	expanded = false,
	isAuthenticated,
	onToggleLike,
	onToggleComments,
	onAddComment,
	textColor = '#000',
	iconColor = 'gray',
	disabledComment = false,
}) => {
	const showHideText = expanded && commentCount > 0 ? 'Hide ' : ''
	const commentDisabled = disabledComment || !isAuthenticated || commentCount === 0

	return (
		<Row paddingHorizontal={Size.M} spacing={8}>
			<Text style={[styles.bottomButton, { color: textColor }]}>
				{likeCount} {likeCount === 1 ? 'like' : 'likes'}
			</Text>

			{isAuthenticated && (
				<Pressable onPress={onToggleLike}>
					<Text style={[styles.bottomButton, { color: liked ? 'red' : iconColor }]}>
						{liked ? '♥' : '♡'}
					</Text>
				</Pressable>
			)}

			<Pressable
				onPress={onToggleComments}
				style={{ paddingHorizontal: Size.M }}
				disabled={commentDisabled}
			>
				<Text
					style={[
						styles.bottomButton,
						{ color: commentDisabled ? '#888' : textColor },
					]}
				>
					{showHideText}
					{commentCount} {commentCount === 1 ? 'comment' : 'comments'}
				</Text>
			</Pressable>

			{isAuthenticated && (
				<Pressable onPress={onAddComment}>
					<Text style={[styles.bottomButton, { color: textColor }]}>Add Comment</Text>
				</Pressable>
			)}
		</Row>
	)
}

const styles = StyleSheet.create({
	bottomButton: {
		fontSize: 16,
	},
})

// apps/web/src/shared/feedback/FeedbackBarContainer.tsx

import React, { useRef, useState } from 'react'
import { FeedbackBar } from '@shared/feedback'
import { CommentsContainer, CommentForm, useFeedback } from './'
import { useAuth, useModal } from '@shared/hooks'
import {
	fetchImageCommentCount,
	fetchPostCommentCount,
	fetchLikeMeta,
	toggleLike,
} from '@iam/services'
import type { RefType } from '@iam/types'
import { View } from 'react-native'

type Props = {
	refId: string
	refType: RefType
	onCommentAdded?: () => void
	onCommentDeleted?: () => void
	disabledComment?: boolean
}

export const FeedbackBarContainer: React.FC<Props> = ({
	refId,
	refType,
	onCommentAdded,
	onCommentDeleted,
	disabledComment = false,
}) => {
	const { isAuthenticated, user } = useAuth()
	const { openFormModal } = useModal()
	const commentsRef = useRef<{ handleNewComment?: (c: any) => void }>(null)
    const [expanded, setExpanded] = useState(false)
	const {
		likeCount,
		liked,
		commentCount,
		handleToggleLike,
		handleToggleComments,
		handleCommentAdded,
		handleCommentDeleted,
	} = useFeedback({
		refId,
		fetchLikeMeta: (id) => fetchLikeMeta(id, refType),
		toggleLike: (id) => toggleLike(id, refType),
		fetchCommentCount:
			refType === 'Post' ? fetchPostCommentCount : fetchImageCommentCount,
	})

	const handleAddComment = () => {
		openFormModal(
			CommentForm,
			{
				id: refId,
				type: refType,
				onCommentAdded: (newComment: any) => {
					handleCommentAdded()
					onCommentAdded?.()
					setExpanded(true)
					commentsRef.current?.handleNewComment?.(newComment)
				},
			},
			{ title: 'Add Comment' }
		)
	}

	return (
		<View>
			<FeedbackBar
				likeCount={likeCount}
				liked={liked}
				commentCount={commentCount}
				expanded={expanded}
				isAuthenticated={isAuthenticated}
				onToggleLike={handleToggleLike}
				onToggleComments={() => {
					handleToggleComments()
					setExpanded(!expanded)
				}}
				onAddComment={handleAddComment}
				disabledComment={disabledComment}
			/>

			{expanded && (
				<CommentsContainer
					ref={commentsRef}
					refId={refId}
					refType={refType}
					onCommentAdded={handleCommentAdded}
					onCommentDeleted={onCommentDeleted || handleCommentDeleted}
				/>
			)}
		</View>
	)
}

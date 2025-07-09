// apps/web/src/components/feedback/LikeCommentBarContainer.tsx

import React, { useRef } from 'react'
import { LikeCommentBar, CommentsContainer, CommentForm } from '@/components'
import { useAuth, useLikeWithComments, useModal } from '@/hooks'
import {
	fetchImageCommentCount,
	fetchPostCommentCount,
	fetchLikeMeta,
	toggleLike,
} from '@services'

type RefType = 'Image' | 'Post'

type Props = {
	refId: string
	refType: RefType
	expanded: boolean
	setExpanded: (expanded: boolean) => void
	onCommentAdded?: () => void
	onCommentDeleted?: () => void
	textColor?: string
	iconColor?: string
	disabledComment?: boolean
}

export const LikeCommentBarContainer: React.FC<Props> = ({
	refId,
	refType,
	expanded,
	setExpanded,
	onCommentAdded,
	onCommentDeleted,
	textColor = '#fff',
	iconColor = '#fff',
	disabledComment = false,
}) => {
	const { isAuthenticated, user } = useAuth()
	const { openFormModal } = useModal()
	const commentsRef = useRef<{ handleNewComment?: (c: any) => void }>(null)

	const {
		likeCount,
		liked,
		commentCount,
		handleToggleLike,
		handleToggleComments,
		handleCommentAdded,
		handleCommentDeleted,
	} = useLikeWithComments({
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
		<>
			<LikeCommentBar
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
				textColor={textColor}
				iconColor={iconColor}
				disabledComment={disabledComment}
			/>

			{expanded && (
				<CommentsContainer
					ref={commentsRef}
					refId={refId}
					refType={refType}
					onCommentAdded={handleCommentAdded}
					onCommentDeleted={onCommentDeleted || handleCommentDeleted}
					textColor={textColor}
				/>
			)}
		</>
	)
}

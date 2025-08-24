// apps/web/src/shared/feedback/FeedbackBarContainer.tsx

import React, { useRef, useState } from 'react'
import { FeedbackBar } from '@shared/feedback'
import { CommentsContainer, useFeedback } from './'
import { useAuth } from '@features/auth'
import {
	fetchImageCommentCount,
	fetchMemoryCommentCount,
	fetchPostCommentCount,
	fetchLikeMeta,
	toggleLike,
} from '@iam/services'
import { RefType } from '@iam/types'

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
	onCommentDeleted,
	disabledComment = false,
}) => {
	const { isAuthenticated } = useAuth()
	const commentsRef = useRef<{ handleNewComment?: (c: any) => void }>(null)
    // const [expanded, setExpanded] = useState(false)
	const {
		commentCount,
        expanded,
		likeCount,
		liked,
		handleToggleLike,
		handleToggleComments,
		handleCommentAdded,
		handleCommentDeleted,
        setExpanded,
	} = useFeedback({
		refId,
		fetchLikeMeta: (id) => fetchLikeMeta(id, refType),
		toggleLike: (id) => toggleLike(id, refType),
		fetchCommentCount:
			refType === RefType.Post
                ? fetchPostCommentCount
                : refType === RefType.Memory
                    ? fetchMemoryCommentCount
                    : fetchImageCommentCount,
	})

	return (
		<>
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
		</>
	)
}

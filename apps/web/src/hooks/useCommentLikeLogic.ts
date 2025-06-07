// apps/web/src/hooks/useCommentLikeLogic.ts

import { useState } from 'react'

type LikeMeta = {
	count: number
	likedByCurrentUser: boolean
}

type Props = {
	refId: string
	initialLikeMeta?: LikeMeta
	initialCommentCount?: number
	toggleLike: (refId: string) => Promise<LikeMeta>
	fetchCommentCount: (refId: string) => Promise<number>
}

export const useCommentLikeLogic = ({
	refId,
	initialLikeMeta = { count: 0, likedByCurrentUser: false },
	initialCommentCount = 0,
	toggleLike,
	fetchCommentCount,
}: Props) => {
	const [likeCount, setLikeCount] = useState(initialLikeMeta.count)
	const [liked, setLiked] = useState(initialLikeMeta.likedByCurrentUser)
	const [commentCount, setCommentCount] = useState(initialCommentCount)
	const [expanded, setExpanded] = useState(false)
	const [commentRefreshToken, setCommentRefreshToken] = useState(0)

	const handleToggleLike = async () => {
		try {
			const data = await toggleLike(refId)
			setLiked(data.likedByCurrentUser)
			setLikeCount(data.count)
		} catch (err) {
			console.error('Failed to toggle like:', err)
		}
	}

	const handleToggleComments = () => {
		setExpanded((prev) => !prev)
	}

	const refreshCommentCount = async () => {
		try {
			const count = await fetchCommentCount(refId)
			setCommentCount(count)
		} catch (err) {
			console.error('Failed to refresh comment count:', err)
		}
	}

	const handleCommentAdded = () => {
		setExpanded(true)
		refreshCommentCount()
		setCommentRefreshToken((prev) => prev + 1)
	}

	const handleCommentDeleted = () => {
		refreshCommentCount()
		setCommentRefreshToken((prev) => prev + 1)
		if (commentCount === 1) setExpanded(false)
	}

	return {
		likeCount,
		liked,
		commentCount,
		expanded,
		commentRefreshToken,
		handleToggleLike,
		handleToggleComments,
		handleCommentAdded,
		handleCommentDeleted,
	}
}

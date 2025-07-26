// apps/web/src/hooks/useFeedback.ts

import { useEffect, useState } from 'react'

type LikeMeta = {
	count: number
	likedByCurrentUser: boolean
}

type Props = {
	refId: string
	initialLikeMeta?: LikeMeta
	initialCommentCount?: number
	toggleLike: (refId: string) => Promise<LikeMeta>
	fetchLikeMeta: (refId: string) => Promise<LikeMeta>
	fetchCommentCount: (refId: string) => Promise<number>
}

export const useFeedback = ({
	refId,
	initialLikeMeta = { count: 0, likedByCurrentUser: false },
	initialCommentCount = 0,
	toggleLike,
	fetchLikeMeta,
	fetchCommentCount,
}: Props) => {
	const [likeCount, setLikeCount] = useState(initialLikeMeta.count)
	const [liked, setLiked] = useState(initialLikeMeta.likedByCurrentUser)
	const [commentCount, setCommentCount] = useState(initialCommentCount)
	const [expanded, setExpanded] = useState(false)
	const [commentRefreshToken, setCommentRefreshToken] = useState(0)

	useEffect(() => {
		const loadInitialMeta = async () => {
			try {
				const [likeData, commentCount] = await Promise.all([
					fetchLikeMeta(refId),
					fetchCommentCount(refId),
				])
				setLiked(likeData.likedByCurrentUser)
				setLikeCount(likeData.count)
				setCommentCount(commentCount)
			} catch (err) {
				console.error('Failed to fetch initial meta:', err)
			}
		}
		loadInitialMeta()
	}, [refId, fetchLikeMeta, fetchCommentCount])	

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

	const handleCommentAdded = () => {
		setExpanded(true)
		setCommentCount(prev => prev + 1)
		setCommentRefreshToken(Date.now())
	}

	const handleCommentDeleted = async () => {
		try {
			const count = await fetchCommentCount(refId)
			setCommentCount(count)
			if (count === 0) setExpanded(false)
		} catch (err) {
			console.error('Failed to refresh comment count:', err)
		}
		setCommentRefreshToken((prev) => prev + 1)
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

// apps/web/src/utils/likes.ts

import type { Like } from '@iam/types'

export const getLikeMetaFromLikes = (
	likes: Like[],
	currentUserId?: string
): { count: number; likedByCurrentUser: boolean } => ({
	count: likes.length,
	likedByCurrentUser: likes.some((like) => like.user.id === currentUserId),
})

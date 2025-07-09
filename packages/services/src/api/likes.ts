// apps/web/src/services/likes.ts

import { api } from './http'
import type { Like } from '@iam/types'

export const toggleLike = (
	refId: string,
	refType: 'Post' | 'Image'
): Promise<{ count: number; likedByCurrentUser: boolean }> =>
	api.post(`/likes/${refId}/like?refType=${refType}`).then((res) => res.data)

export const fetchLikes = (
	refId: string,
	refType: 'Post' | 'Image'
): Promise<Like[]> =>
	api.get(`/likes/${refId}/likes?refType=${refType}`).then((res) => res.data as Like[])

export const fetchLikeMeta = (
	refId: string,
	refType: 'Post' | 'Image'
): Promise<{ count: number; likedByCurrentUser: boolean }> =>
	api.get(`/likes/${refId}/meta?refType=${refType}`).then((res) => res.data)

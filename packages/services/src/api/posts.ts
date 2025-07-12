// packages/services/src/api/posts.ts

import { api } from './http'
import { RefType, type Post } from '@iam/types'
import * as commentService from './comments'

export const getAllPosts = async (): Promise<Post[]> => {
	const res = await api.get('/posts')
	return res.data
}

export const getPostById = async (id: string): Promise<Post> => {
	const res = await api.get<Post>(`/posts/${id}`)
	return res.data
}

export const createPost = async (
	content: string,
	imageId?: string
): Promise<Post> => {
	const res = await api.post(
		'/posts',
		{ content, imageId },
		{ withCredentials: true },
	)
	return res.data
}

export const fetchPostLikes = async (postId: string) => {
	const res = await api.get(`/posts/${postId}/likes`)
	return res.data
}  

export const togglePostLike = async (postId: string): Promise<Post> => {
	const res = await api.post(`/posts/${postId}/like`, {}, { withCredentials: true })
	return res.data
}

export const updatePost = async (id: string, content: string): Promise<Post> => {
	const res = await api.put(`/posts/${id}`, { content }, { withCredentials: true })
	return res.data
}

export const deletePost = async (id: string): Promise<{ success: boolean }> => {
	const res = await api.delete(`/posts/${id}`, { withCredentials: true })
	return res.data
}

export const fetchPostCommentCount = async (postId: string): Promise<number> => {
	const summary = await commentService.fetchCommentSummary(postId, RefType.Post)
	return summary.count
}

export const fetchPostComments = async (postId: string) => {
	return commentService.fetchComments(postId, RefType.Post)
}

export const addPostComment = async (postId: string, content: string) => {
	return commentService.addComment(postId, RefType.Post, content)
}

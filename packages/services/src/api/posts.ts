// packages/services/src/api/posts.ts

import { api } from './http'
import { UploadedImage, Post } from '@iam/types'
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
	image?: UploadedImage
): Promise<Post> => {
	const res = await api.post(
		'/posts',
		{ content, image },
		{ withCredentials: true },
	)
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
	const summary = await commentService.fetchCommentSummary(postId, 'Post')
	return summary.count
}

export const fetchPostComments = async (postId: string) => {
	return commentService.fetchComments(postId, 'Post')
}

export const addPostComment = async (postId: string, content: string) => {
	return commentService.addComment(postId, 'Post', content)
}

export const scrape = async (url: string): Promise<any> => {
	if (!url || typeof url !== 'string') {
		throw new Error('INVALID_URL: Need to provide a valid URL')
	}
	try {
		const { data } = await api.post('/posts/scrape', { url })
		return data.response
	} catch (err) {
		console.error(`Scrape failed for ${url}`, err)
		return null
	}
}

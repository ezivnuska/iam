// packages/services/posts.ts

import { api } from './http'
import { Post } from '@iam/types'
import * as commentService from './comments'

export const getAllPosts = async (): Promise<Post[]> => api.get('/posts').then((res) => res.data)
export const getPostById = async (id: string): Promise<Post> => api.get(`/posts/${id}`).then((res) => res.data)
export const createPost = async (content: string): Promise<Post> => api.post('/posts', { content }, { withCredentials: true }).then((res) => res.data)
export const togglePostLike = async (postId: string): Promise<Post> => api.post(`/posts/${postId}/like`, { withCredentials: true }).then((res) => res.data)
export const updatePost = async (id: string, content: string): Promise<Post> => api.put(`/posts/${id}`, { content }, { withCredentials: true }).then((res) => res.data)
export const deletePost = async (id: string): Promise<{ success: boolean }> => api.delete(`/posts/${id}`, { withCredentials: true }).then((res) => res.data)

export const scrape = async (url: string) => {
    if (!url || typeof url !== 'string') {
        throw new Error('INVALID_URL: Need to provide a valid URL')
    }
	try {
		const { data } = await api.post('/posts/scrape', { url })
		return data
	} catch (err) {
		console.error('Scrape failed:', err)
		return {}
	}
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
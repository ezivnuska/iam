// packages/services/posts.ts

import { api } from './http'
import { Post } from '@iam/types'

export const getAllPosts = async (): Promise<Post[]> => api.get('/posts').then((res) => res.data)
export const getPostById = async (id: string): Promise<Post> => api.get(`/posts/${id}`).then((res) => res.data)
export const createPost = async (content: string): Promise<Post> => api.post('/posts', { content }, { withCredentials: true }).then((res) => res.data)
export const updatePost = async (id: string, content: string): Promise<Post> => api.put(`/posts/${id}`, { content }, { withCredentials: true }).then((res) => res.data)
export const deletePost = async (id: string): Promise<{ success: boolean }> => api.delete(`/posts/${id}`, { withCredentials: true }).then((res) => res.data)
// apps/web/src/providers/PostsProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react'
import * as postService from '@services'
import { Post } from '@iam/types'

export type PostsContextType = {
	posts: Post[]
	loading: boolean
	error: string | null
	refreshPosts: () => Promise<void>
    addPost: (post: Post) => void
    setPosts: (posts: Post[]) => void
	deletePost: (id: string) => Promise<void>
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined)

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const refreshPosts = async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await postService.getAllPosts()
			setPosts(data)
		} catch (err: any) {
			console.error('Failed to load posts:', err)
			setError('Failed to load posts')
		} finally {
			setLoading(false)
		}
	}

	const addPost = (post: Post) => {
        setPosts((prev) => [post, ...prev])
    }

	const deletePost = async (id: string) => {
		try {
			await postService.deletePost(id)
			setPosts((prev) => prev.filter((p) => p._id !== id))
		} catch (err) {
			throw err
		}
	}

	return (
		<PostsContext.Provider value={{ posts, loading, error, refreshPosts, addPost, setPosts, deletePost }}>
			{children}
		</PostsContext.Provider>
	)
}
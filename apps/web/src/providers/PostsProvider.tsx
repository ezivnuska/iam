// apps/web/src/providers/PostsProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react'
import * as postService from '@services'
import { Post } from '@iam/types'

export type PostsContextType = {
	posts: Post[]
	loading: boolean
    commentCounts: Record<string, number>
	error: string | null
	refreshPosts: () => Promise<void>
    addPost: (post: Post) => void
    setPosts: (posts: Post[]) => void
	deletePost: (id: string) => Promise<void>
	refreshCommentCounts: (posts?: Post[]) => Promise<void>
    setCommentCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined)

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

	const refreshCommentCounts = async (targetPosts?: Post[]) => {
		const counts: Record<string, number> = {}

		await Promise.all((targetPosts ?? posts).map(async (post) => {
			try {
				const summary = await postService.fetchCommentSummary(post._id, 'Post')
				counts[post._id] = summary.count
			} catch (err) {
				console.error(`Error fetching comment summary for post ${post._id}`, err)
			}
		}))

		setCommentCounts(counts)
	}

	const refreshPosts = async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await postService.getAllPosts()
			setPosts(data)
			await refreshCommentCounts(data)
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
		<PostsContext.Provider
			value={{
				commentCounts,
				error,
				loading,
				posts,
				addPost,
				deletePost,
				refreshCommentCounts,
				refreshPosts,
                setCommentCounts,
				setPosts,
			}}
		>
			{children}
		</PostsContext.Provider>
	)
}

// apps/web/src/providers/PostsProvider.tsx

import React, { createContext, useState } from 'react'
import * as postService from '@services'
import { Post } from '@iam/types'
import { getErrorMessage } from '@/utils'

export type PostsContextType = {
	error: string | null
	isRefreshing: boolean
	isMutating: boolean
	isInitialized: boolean
	posts: Post[]
	addPost: (post: Post) => void
	deletePost: (id: string) => Promise<void>
	refreshPosts: () => Promise<void>
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined)

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, setState] = useState<{
		posts: Post[]
		isRefreshing: boolean
		isMutating: boolean
		isInitialized: boolean
		error: string | null
	}>({
		posts: [],
		isRefreshing: false,
		isMutating: false,
		isInitialized: false,
		error: null,
	})

	const refreshPosts = async () => {
		const isInitial = !state.isInitialized

		setState(prev => ({
			...prev,
			isRefreshing: true,
			error: null,
		}))

		try {
			const data = await postService.getAllPosts()
			setState(prev => ({
				...prev,
				posts: data,
				isInitialized: true,
			}))
		} catch (err) {
			setState(prev => ({
				...prev,
				error: getErrorMessage(err),
			}))
		} finally {
			setState(prev => ({
				...prev,
				isRefreshing: false,
			}))
		}
	}

	const addPost = (post: Post) => {
		setState(prev => ({ ...prev, posts: [post, ...prev.posts] }))
	}

	const deletePost = async (id: string) => {
		const previousPosts = state.posts
		setState(prev => ({
			...prev,
			isMutating: true,
			posts: prev.posts.filter(post => post._id !== id),
		}))

		try {
			await postService.deletePost(id)
		} catch (err) {
			setState(prev => ({
				...prev,
				error: getErrorMessage(err),
				posts: previousPosts,
			}))
		} finally {
			setState(prev => ({
				...prev,
				isMutating: false,
			}))
		}
	}

	return (
		<PostsContext.Provider
			value={{
				error: state.error,
				isRefreshing: state.isRefreshing,
				isMutating: state.isMutating,
				isInitialized: state.isInitialized,
				posts: state.posts,
				addPost,
				deletePost,
				refreshPosts,
			}}
		>
			{children}
		</PostsContext.Provider>
	)
}

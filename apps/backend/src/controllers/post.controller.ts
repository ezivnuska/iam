// apps/backend/src/controllers/post.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as postService from '../services/post.service'
import { Comment } from '../models/comment.model'
import { ScrapeError, scrapeMetadata } from '../utils/metadata.utils'
import { ensureUser } from '../utils/controller.utils'

/* ------------------------------- POST CRUD ------------------------------- */

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const userId = ensureUser(req, res)
	if (!userId) return

	try {
		const post = await postService.createPost(userId, req.body.content)
		res.status(201).json(post)
	} catch (err) {
		next(err)
	}
}

export const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const posts = await postService.getAllPosts(req.user?.id)
		res.json(posts)
	} catch (err) {
		next(err)
	}
}

export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const post = await postService.getPostById(req.params.id)
		const enrichedPost = post.toJSON()
		enrichedPost.likedByCurrentUser = post.likes.some(id => id.equals(req.user?.id))
		res.json(enrichedPost)
	} catch (err) {
		next(err)
	}
}

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const userId = ensureUser(req, res)
	if (!userId) return

	try {
		const post = await postService.updatePost(req.params.id, userId, req.body.content)
		res.json(post)
	} catch (err) {
		next(err)
	}
}

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const userId = ensureUser(req, res)
	if (!userId) return

	try {
		await postService.deletePost(req.params.id, userId)
		await Comment.deleteMany({ refId: req.params.id, refType: 'Post' })
		res.status(204).end()
	} catch (err) {
		next(err)
	}
}

export const getPostLikes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const likes = await postService.getPostLikes(req.params.postId)
		res.json(likes)
	} catch (err) {
		next(err)
	}
}

export const toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const userId = ensureUser(req, res)
	if (!userId) return

	try {
		const post = await postService.togglePostLike(userId, req.params.postId)
		res.json(post)
	} catch (err) {
		next(err)
	}
}

/* ---------------------------- MAIN SCRAPE ENTRY ---------------------------- */

export const scrapePost = async (req: Request, res: Response): Promise<void> => {
	const { url } = req.body
	if (!url) {
		res.status(400).json({ message: 'URL is required' })
		return
	}

	try {
		const metadata = await scrapeMetadata(url)
		res.status(200).json({ response: metadata })
	} catch (err: any) {
		const message = err instanceof Error ? err.message : 'Unknown error'

		console.error('scrapePost error:', message)

		if (err instanceof ScrapeError) {
			if (message.includes('Invalid URL')) {
				res.status(400).json({ message })
			} else if (message.includes('timed out')) {
				res.status(504).json({ message })
			} else if (message.includes('Host not found')) {
				res.status(404).json({ message })
			} else {
				res.status(502).json({ message })
			}
		} else {
			res.status(500).json({ message: 'Internal server error' })
		}
	}
}

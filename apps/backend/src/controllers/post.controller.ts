// apps/backend/src/controllers/post.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as postService from '../services/post.service'
import { Comment } from '../models/comment.model'
import { ScrapeError, scrapeMetadata } from '../utils/metadata.utils'
import { RefType } from '@iam/types'

/* ------------------------------- POST CRUD ------------------------------- */

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { content, imageId } = req.body
		const post = await postService.createPost(req.user!.id, content, imageId)
		res.status(201).json(post)
	} catch (err) {
		next(err)
	}
}

export const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const posts = await postService.getAllPosts()
		res.json(posts)
	} catch (err) {
		next(err)
	}
}

export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const post = await postService.getPostById(req.params.id)
		res.json(post)
	} catch (err) {
		next(err)
	}
}

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const post = await postService.updatePost(req.params.id, req.user!.id, req.body.content)
		res.json(post)
	} catch (err) {
		next(err)
	}
}

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await postService.deletePost(req.params.id, req.user!.id)
		await Comment.deleteMany({ refId: req.params.id, refType: RefType.Post })
		res.status(204).end()
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

export const scrapePostLinkPreview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params
		const updatedPost = await postService.scrapeAndUpdateLinkPreview(id)

		if (!updatedPost) {
			res.status(404).json({ error: 'Post not found or no link to scrape' })
			return
		}

		res.status(200).json(updatedPost)
	} catch (err) {
		next(err)
	}
}

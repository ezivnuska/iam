// apps/backend/src/controllers/post.controller.ts

import { Request, Response } from 'express'
import * as postService from '../services/post.service'

export const createPost = async (req: Request, res: Response) => {
	if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	const { content } = req.body
	const post = await postService.createPost(req.user.id, content)
	res.status(201).json(post)
}

export const getAllPosts = async (_req: Request, res: Response) => {
	const posts = await postService.getAllPosts()
	res.json(posts)
}

export const getPostById = async (req: Request, res: Response) => {
	const post = await postService.getPostById(req.params.id)
	if (!post) {
		res.status(404).json({ message: 'Post not found' })
		return
	}
	res.json(post)
}

export const updatePost = async (req: Request, res: Response) => {
	if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}
	const post = await postService.updatePost(req.params.id, req.user.id, req.body.content)
	if (!post) {
		res.status(404).json({ message: 'Post not found' })
		return
	}
	res.json(post)
}

export const deletePost = async (req: Request, res: Response) => {
	if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}
	await postService.deletePost(req.params.id, req.user.id)
	res.status(204).end()
}
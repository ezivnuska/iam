// apps/backend/src/controllers/post.controller.ts

import { Request, Response } from 'express'
import * as postService from '../services/post.service'
import puppeteer from 'puppeteer'

// Core post CRUD handlers
export const createPost = async (req: Request, res: Response): Promise<void> => {
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

export const getPostById = async (req: Request, res: Response): Promise<void> => {
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

// -------------------- SCRAPING LOGIC --------------------

const getContent = async (url: string) => {
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()

	await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
	const html = await page.content()

	await browser.close()
	return { html, url }
}


// Metascraper setup
const metascraper = require('metascraper')([
	require('metascraper-description')(),
	require('metascraper-image')(),
	require('metascraper-title')(),
])

// Main scrape handler
export const scrapePost = async (req: Request, res: Response): Promise<void> => {
	const { url } = req.body

	if (!url) {
		res.status(400).json({ message: 'URL is required' })
		return
	}

	try {
		const { html } = await getContent(url)
		const metadata = await metascraper({ html, url })

		res.status(200).json({ response: metadata })
	} catch (error) {
		console.error('Error scraping URL:', error)
		res.status(500).json({ message: 'Failed to scrape metadata' })
	}
}

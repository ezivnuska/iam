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

export const getAllPosts = async (req: Request, res: Response) => {
    const userId = req.user?.id
    const posts = await postService.getAllPosts(userId)
    res.json(posts)
}

export const getPostById = async (req: Request, res: Response): Promise<void> => {
	const post = await postService.getPostById(req.params.id)
    const currentUserId = req.user?.id

	if (!post) {
		res.status(404).json({ message: 'Post not found' })
		return
	}

	const enrichedPost = post.toJSON()
    enrichedPost.likedByCurrentUser = post.likes.some(id => id.equals(currentUserId))

    res.json(enrichedPost)
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

export const getPostLikes = async (req: Request, res: Response) => {
	const postId = req.params.postId

	const likes = await postService.getPostLikes(postId)
	if (!likes) {
		res.status(404).json({ message: 'Post not found' })
		return
	}

	res.json(likes)
}

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
		res.status(401).json({ message: 'Unauthorized' })
        return
	}

    const userId = req.user.id
    const postId = req.params.postId
	
    const post = await postService.toggleLike(userId, postId)
	
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

const getContent = async (url: string, maxRetries = 3): Promise<{ html: string; url: string }> => {
	let attempt = 0
	let lastError: unknown

	while (attempt < maxRetries) {
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 20000,
        })

		try {
			const page = await browser.newPage()

            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                'Chrome/115.0.0.0 Safari/537.36'
            )

            const canonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null)
            const finalUrl = canonical && canonical !== url ? canonical : url

            if (finalUrl !== url) {
                await page.goto(finalUrl, {
                    timeout: 15000,
                    waitUntil: 'domcontentloaded',
                })
            }

			const html = await page.content()

			return { html, url: finalUrl }
		} catch (error) {
			lastError = error
			console.warn(`Attempt ${attempt + 1} failed:`, error)

			// Delay before retrying
			const delay = 1000 * 2 ** attempt // exponential backoff: 1s, 2s, 4s...
			await new Promise((resolve) => setTimeout(resolve, delay))
		} finally {
			await browser.close()
        }

		attempt++
	}

	throw new Error(`Failed to load URL after ${maxRetries} attempts: ${url}\nLast error: ${lastError}`)
}

// Metascraper setup
const metascraper = require('metascraper')([
	require('metascraper-author')(),
	require('metascraper-date')(),
	require('metascraper-description')(),
	require('metascraper-image')(),
	require('metascraper-title')(),
])

function normalizeUrl(url: string): string {
    try {
        const u = new URL(url)
        if (u.hostname.startsWith('m.')) {
            u.hostname = u.hostname.replace(/^m\./, 'www.')
        }
        return u.toString()
    } catch (e) {
        throw new Error(`Invalid URL provided: ${url}`)
    }
}

// Main scrape handler
export const scrapePost = async (req: Request, res: Response): Promise<void> => {
	const { url } = req.body

	if (!url) {
		res.status(400).json({ message: 'URL is required' })
		return
	}

    const normalizedUrl = normalizeUrl(url)
    
	try {
		const { html } = await getContent(normalizedUrl)
		const metadata = await metascraper({ html, url: normalizedUrl })

		res.status(200).json({ response: metadata })
	} catch (error) {
		console.error('Error scraping URL:', normalizedUrl, error)
		res.status(500).json({ message: 'Failed to scrape metadata' })
	}
}

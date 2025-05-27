// apps/backend/src/controllers/post.controller.ts

import { Request, Response } from 'express'
import * as postService from '../services/post.service'
import puppeteer, { Page } from 'puppeteer'

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

    const goTo = async (page: Page, url: string) => {
        return Promise.race([
            page.goto(url, { timeout: 40000, waitUntil: 'domcontentloaded' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('goto timeout exceeded')), 35000)),
        ])
    }

	while (attempt < maxRetries) {
		const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 50,
			headless: true,
			// headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
            protocolTimeout: 60000,
		})

		try {
			const page = await browser.newPage()
            // page.setDefaultTimeout(30000)

			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
				'AppleWebKit/537.36 (KHTML, like Gecko) ' +
				'Chrome/115.0.0.0 Safari/537.36'
			)

			// Attempt to detect canonical URL
			const canonical = await Promise.race([
                page.$eval('link[rel="canonical"]', el => el.getAttribute('href')),
                new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout getting canonical')), 5000)),
            ]).catch(() => null)
			const finalUrl = canonical && canonical !== url ? canonical : url

			await goTo(page, finalUrl)
			// If canonical differs, reload the final page
			// if (finalUrl !== url) {
            //     console.log(`Canonical redirect: ${url} → ${finalUrl}`)
            //     await goTo(page, finalUrl)
			// }

			// Delay to allow scripts to finish loading
			// await new Promise(resolve => setTimeout(resolve, 3000))

			// Grab HTML content
			const html = await page.content()

			// Optional debug
			// const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content')).catch(() => null)
			// console.log('og:title:', ogTitle)

			return { html, url: finalUrl }
		} catch (error) {
			lastError = error
			console.warn(`Attempt ${attempt + 1} failed:`, error)

			// Exponential backoff delay before retrying
			const backoff = 1000 * 2 ** attempt
			await new Promise(resolve => setTimeout(resolve, backoff))
		} finally {
			await browser.close()
		}

		attempt++
	}

	throw new Error(`Failed to load URL after ${maxRetries} attempts: ${url}\nLast error: ${lastError}`)
}

// Metascraper setup
const metascraper = require('metascraper')([
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

// apps/backend/src/controllers/post.controller.ts

import { Request, Response } from 'express'
import * as postService from '../services/post.service'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Page } from 'puppeteer'
// import getYouTubeMetaData from 'youtube-meta-data'
import fetch, { AbortError } from 'node-fetch'

interface OEmbedResponse {
    title: string
    thumbnail_url: string
}

puppeteer.use(StealthPlugin())

/* --------------------------------- UTILITIES --------------------------------- */

const ensureAuth = (req: Request, res: Response): string | null => {
    const userId = req.user?.id
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return null
    }
    return userId
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/* ------------------------------- POST CRUD ------------------------------- */

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const userId = ensureAuth(req, res)
    if (!userId) return

    try {
        const post = await postService.createPost(userId, req.body.content)
        res.status(201).json(post)
    } catch (err) {
        console.error('Create post error:', err)
        res.status(500).json({ message: 'Failed to create post' })
    }
}

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPosts(req.user?.id)
        res.json(posts)
    } catch (err) {
        console.error('Get posts error:', err)
        res.status(500).json({ message: 'Failed to get posts' })
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await postService.getPostById(req.params.id)
        if (!post) {
			res.status(404).json({ message: 'Post not found' })
			return
		}

        const enrichedPost = post.toJSON()
        enrichedPost.likedByCurrentUser = post.likes.some(id => id.equals(req.user?.id))
        res.json(enrichedPost)
    } catch (err) {
        console.error('Get post error:', err)
        res.status(500).json({ message: 'Failed to get post' })
    }
}

export const updatePost = async (req: Request, res: Response) => {
    const userId = ensureAuth(req, res)
    if (!userId) return

    try {
        const post = await postService.updatePost(req.params.id, userId, req.body.content)
        if (!post) {
			res.status(404).json({ message: 'Post not found' })
			return
		}

        res.json(post)
    } catch (err) {
        console.error('Update post error:', err)
        res.status(500).json({ message: 'Failed to update post' })
    }
}

export const deletePost = async (req: Request, res: Response) => {
    const userId = ensureAuth(req, res)
    if (!userId) return

    try {
        await postService.deletePost(req.params.id, userId)
        res.status(204).end()
    } catch (err) {
        console.error('Delete post error:', err)
        res.status(500).json({ message: 'Failed to delete post' })
    }
}

export const getPostLikes = async (req: Request, res: Response) => {
    try {
        const likes = await postService.getPostLikes(req.params.postId)
        if (!likes) {
			res.status(404).json({ message: 'Post not found' })
			return
		}
        res.json(likes)
    } catch (err) {
        console.error('Get likes error:', err)
        res.status(500).json({ message: 'Failed to get post likes' })
    }
}

export const toggleLike = async (req: Request, res: Response) => {
    const userId = ensureAuth(req, res)
    if (!userId) return

    try {
        const post = await postService.toggleLike(userId, req.params.postId)
        if (!post) {
			res.status(404).json({ message: 'Post not found' })
			return
		}
        res.json(post)
    } catch (err) {
        console.error('Toggle like error:', err)
        res.status(500).json({ message: 'Failed to toggle like' })
    }
}

/* ---------------------------- SCRAPER HELPERS ---------------------------- */

const goToWithRetries = async (page: Page, url: string, maxRetries = 3) => {
    let lastError
    for (let i = 0; i < maxRetries; i++) {
        try {
            await page.goto(url, {
                timeout: 45000,
                waitUntil: 'domcontentloaded'
            })
            return
        } catch (err) {
            lastError = err
            console.warn(`goto retry ${i + 1} failed:`, err)
            await delay(1000 * 2 ** i)
        }
    }
    throw new Error(`goto failed after ${maxRetries} attempts: ${lastError}`)
}

async function getContent(url: string, maxRetries = 3): Promise<{ html: string; url: string }> {
	let lastError
	const visited = new Set<string>()

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		let browser
		try {
			browser = await puppeteer.launch({
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--ignore-certificate-errors',
				]
			})

			const page = await browser.newPage()

			// ✅ Wait briefly to avoid "Requesting main frame too early!" error
			// await delay(50)

			await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36')
			// await page.setJavaScriptEnabled(true)
			await page.setRequestInterception(true)

			page.on('request', req => {
				try {
					const block = ['image', 'stylesheet', 'font', 'media']
					block.includes(req.resourceType()) ? req.abort() : req.continue()
				} catch (e) {
					console.warn('Request interception error:', e)
				}
			})

			visited.add(url)
			await page.goto(url, {
				timeout: 90000,
				waitUntil: 'domcontentloaded',//'networkidle2'
			})
			
			const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href')).catch(() => null)
			if (canonical && canonical !== url && !visited.has(canonical)) {
				await page.goto(canonical, { waitUntil: 'domcontentloaded' })
			}
			const finalUrl = canonical && canonical !== url && !visited.has(canonical) ? canonical : url
			
			if (finalUrl !== url) {
				await page.goto(finalUrl, {
					timeout: 90000,
					waitUntil: 'domcontentloaded'
				})
			}			

			const html = await page.content()
			return { html, url: finalUrl }
		} catch (err) {
			lastError = err
			console.warn(`Attempt ${attempt + 1} failed:`, err)
			await delay(1000 * 2 ** attempt)
		} finally {
			if (browser) await browser.close()
		}
	}

	throw new Error(`Failed to load URL: ${url}\nError: ${lastError}`)
}

/* ----------------------------- METADATA UTILS ---------------------------- */

const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')()
])

function normalizeUrl(url: string): string {
    try {
        const u = new URL(url)
        if (u.hostname.startsWith('m.')) u.hostname = u.hostname.replace(/^m\./, 'www.')
        return u.toString()
    } catch {
        throw new Error(`Invalid URL: ${url}`)
    }
}

const oEmbedProviders = [
    {
        regex: /youtube\.com|youtu\.be/,
        endpoint: 'https://www.youtube.com/oembed',
        requiresAuth: false
    },
    // Uncomment and configure for auth:
    {
        regex: /instagram\.com/,
        endpoint: 'https://graph.facebook.com/v23.0/instagram_oembed',
        requiresAuth: true,
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    },
    {
        regex: /facebook\.com/,
        endpoint: 'https://graph.facebook.com/v23.0/oembed_post',
        requiresAuth: true,
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    },
]

function findOEmbedProvider(url: string) {
    return oEmbedProviders.find(p => p.regex.test(url))
}

async function fetchOEmbed(url: string) {
    const provider = findOEmbedProvider(url)
    if (!provider) return null

    let oembedUrl = `${provider.endpoint}?url=${encodeURIComponent(url)}&format=json`

    if (provider.requiresAuth) {
        // const appId = process.env.FACEBOOK_APP_ID
        // const appSecret = process.env.FACEBOOK_APP_SECRET
        if (!provider.accessToken) throw new Error('Facebook App credentials missing')
        oembedUrl += `&access_token=${provider.accessToken}`
    }
    console.log('oembedUrl', oembedUrl)
    const res = await fetch(oembedUrl)

    const rawText = await res.text()

    if (!res.ok) {
        console.error('oEmbed failed response:', rawText)
        throw new Error(`Failed to fetch oEmbed: ${res.status}`)
    }

    let data: OEmbedResponse
    try {
        data = JSON.parse(rawText)
    } catch (err) {
        throw new Error('Invalid JSON in oEmbed response')
    }

    return {
        title: data.title || '',
        description: '',
        image: data.thumbnail_url || ''
    }
}

// import crypto from 'crypto'

// function getAppSecretProof(accessToken: string, appSecret: string) {
// 	return crypto
// 		.createHmac('sha256', appSecret)
// 		.update(accessToken)
// 		.digest('hex')
// }

async function getYoutubeMetadataSafe(url: string) {
    try {
        return await fetchOEmbed(url)
    } catch (e) {
        console.warn('Fallback failed, retrying...', e)
        throw e
    }
}

/* ---------------------------- MAIN SCRAPE ENTRY ---------------------------- */

export const scrapePost = async (req: Request, res: Response) => {
    const { url } = req.body
    if (!url) {
		res.status(400).json({ message: 'URL is required' })
		return
	}

    const normalizedUrl = normalizeUrl(url)
    console.log('normalizedUrl', normalizedUrl)
    try {
        const isYouTube = /youtube\.com|youtu\.be/.test(normalizedUrl)
        let metadata = findOEmbedProvider(normalizedUrl) ? await fetchOEmbed(normalizedUrl) : null

        if (!metadata?.title) {
            metadata = isYouTube
                ? await getYoutubeMetadataSafe(normalizedUrl)
                : await metascraper({ html: (await getContent(normalizedUrl)).html, url: normalizedUrl })
        }

        res.status(200).json({ response: metadata })
    } catch (err) {
        console.error('Scrape error:', err)
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(message.includes('timeout') ? 504 : 500).json({ message })
    }
}

// apps/backend/src/controllers/post.controller.ts

import { Request, Response } from 'express'
import * as postService from '../services/post.service'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Page } from 'puppeteer'
import getYouTubeMetaData from 'youtube-meta-data'
import fetch, { AbortError } from 'node-fetch'

puppeteer.use(StealthPlugin())

// Core post CRUD handlers
export const createPost = async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    const { content } = req.body
    try {
        const post = await postService.createPost(req.user.id, content)
        res.status(201).json(post)
    } catch (err) {
        console.error('Failed to create post:', err)
        res.status(500).json({ message: 'Failed to create post' })
    }
}

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const posts = await postService.getAllPosts(userId)
        res.json(posts)
    } catch (err) {
        console.error('Failed to get posts:', err)
        res.status(500).json({ message: 'Failed to get posts' })
    }
}

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await postService.getPostById(req.params.id)
        const currentUserId = req.user?.id

        if (!post) {
            res.status(404).json({ message: 'Post not found' })
            return
        }

        const enrichedPost = post.toJSON()
        enrichedPost.likedByCurrentUser = post.likes.some(id => id.equals(currentUserId))

        res.json(enrichedPost)
    } catch (err) {
        console.error('Failed to get post:', err)
        res.status(500).json({ message: 'Failed to get post' })
    }
}

export const updatePost = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    try {
        const post = await postService.updatePost(req.params.id, req.user.id, req.body.content)
        if (!post) {
            res.status(404).json({ message: 'Post not found' })
            return
        }
        res.json(post)
    } catch (err) {
        console.error('Failed to update post:', err)
        res.status(500).json({ message: 'Failed to update post' })
    }
}

export const getPostLikes = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId
        const likes = await postService.getPostLikes(postId)
        if (!likes) {
            res.status(404).json({ message: 'Post not found' })
            return
        }
        res.json(likes)
    } catch (err) {
        console.error('Failed to get likes:', err)
        res.status(500).json({ message: 'Failed to get post likes' })
    }
}

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    try {
        const userId = req.user.id
        const postId = req.params.postId
        const post = await postService.toggleLike(userId, postId)

        if (!post) {
            res.status(404).json({ message: 'Post not found' })
            return
        }
        res.json(post)
    } catch (err) {
        console.error('Failed to toggle like:', err)
        res.status(500).json({ message: 'Failed to toggle like' })
    }
}

export const deletePost = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    try {
        await postService.deletePost(req.params.id, req.user.id)
        res.status(204).end()
    } catch (err) {
        console.error('Failed to delete post:', err)
        res.status(500).json({ message: 'Failed to delete post' })
    }
}

// -------------------- SCRAPING LOGIC --------------------

const goToWithRetries = async (page: Page, url: string, maxRetries = 3) => {
    let lastErr
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`goto attempt ${i + 1}: ${url}`)
            await page.goto(url, {
                timeout: 45000,
                waitUntil: 'domcontentloaded',//'networkidle2',
            })
            return
        } catch (err) {
            lastErr = err
            console.warn(`goto failed (attempt ${i + 1}):`, err)
            await new Promise(res => setTimeout(res, 1000 * 2 ** i))
        }
    }
    throw new Error(`goto failed after ${maxRetries} retries: ${lastErr}`)
}

async function getContent(url: string, maxRetries = 3): Promise<{ html: string; url: string }> {
    let attempt = 0
    let lastError: unknown
    const visited = new Set<string>()

    while (attempt < maxRetries) {
        let browser
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })

            const page = await browser.newPage()
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36')
            await page.setJavaScriptEnabled(true)
            await page.setRequestInterception(true)

            page.on('request', request => {
                const blockedTypes = ['image', 'stylesheet', 'font', 'media', 'xhr']
                if (blockedTypes.includes(request.resourceType())) request.abort()
                else request.continue()
            })

            visited.add(url)
            await goToWithRetries(page, url)

            const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href')).catch(() => null)
            const finalUrl = canonical && canonical !== url && !visited.has(canonical) ? canonical : url

            if (finalUrl !== url) {
                console.log(`Navigating to canonical: ${finalUrl}`)
                visited.add(finalUrl)
                await goToWithRetries(page, finalUrl)
            }

            const html = await page.content()
            return { html, url: finalUrl }
        } catch (error) {
            lastError = error
            console.warn(`Attempt ${attempt + 1} failed:`, error)
            const backoff = 1000 * 2 ** attempt
            await new Promise(res => setTimeout(res, backoff))
        } finally {
            if (browser) await browser.close()
        }
        attempt++
    }

    throw new Error(`Failed to load URL after ${maxRetries} attempts: ${url}\nLast error: ${lastError}`)
}

function normalizeYouTubeMetadata(raw: any): { title: string; description?: string; image?: string } {
    const { title, description, embedinfo } = raw
    return {
        title: title || embedinfo?.title || '',
        description: description || '',
        image: embedinfo?.thumbnail_url || ''
    }
}

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

interface YouTubeOEmbedResponse {
    title: string
    thumbnail_url: string
}

async function fetchOEmbed(url: string) {
    const providers = [
        { regex: /youtube\.com|youtu\.be/, endpoint: 'https://www.youtube.com/oembed' },
        { regex: /instagram\.com/, endpoint: 'https://graph.facebook.com/v8.0/instagram_oembed' },
        { regex: /facebook\.com/, endpoint: 'https://graph.facebook.com/v8.0/oembed_page' },
    ]

    for (const { regex, endpoint } of providers) {
        if (regex.test(url)) {
            const oembedUrl = `${endpoint}?url=${encodeURIComponent(url)}&format=json`
            const res = await fetch(oembedUrl)
            const data = await res.json() as YouTubeOEmbedResponse
            return {
                title: data.title || '',
                description: '',
                image: data.thumbnail_url || '',
            }
        }
    }
}

async function getYouTubeMetadataFallback(url: string) {
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    try {
        const res = await fetch(oembed, { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to fetch oEmbed')
        const data = (await res.json()) as YouTubeOEmbedResponse
        return {
            title: data.title,
            description: '',
            image: data.thumbnail_url
        }
    } catch (err) {
        console.error('Fetch oEmbed failed:', err)
        throw err
    } finally {
        clearTimeout(timeout)
    }
}

async function getYoutubeMetadataSafe(url: string) {
    try {
		return await getYouTubeMetadataFallback(url)
        // const rawYoutube = await getYouTubeMetaData(url)
        // if (!rawYoutube.title || !rawYoutube.embedinfo || !rawYoutube.embedinfo.thumbnail_url) {
        //     console.warn('youtube-meta-data missing info, falling back to oEmbed')
        //     return await getYouTubeMetadataFallback(url)
        // }
        // return normalizeYouTubeMetadata(rawYoutube)
    } catch (e) {
        console.error('youtube-meta-data error:', e)
        return await getYouTubeMetadataFallback(url)
    }
}

export const scrapePost = async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body
    if (!url) {
        res.status(400).json({ message: 'URL is required' })
        return
    }

    const normalizedUrl = normalizeUrl(url)
    // const controller = new AbortController()
    // const timeout = setTimeout(() => controller.abort(), 45000)
    let clientAborted = false

    // req.on('close', () => {
    //     if (!res.writableEnded) {
    //         console.warn('Client disconnected during scrape:', normalizedUrl)
    //         controller.abort()
    //         clientAborted = true
    //     }
    // })

    try {
        let metadata: { title: string; description?: string; image?: string }

        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(normalizedUrl)) {
            metadata = await getYoutubeMetadataSafe(normalizedUrl)
        } else {
            const { html } = await getContent(normalizedUrl)
            metadata = await metascraper({ html, url: normalizedUrl })
            if (!metadata || !metadata.title) throw new Error('Failed to extract metadata')
        }

        if (!clientAborted && !res.headersSent && res.writableEnded === false) {
			res.status(200).json({ response: metadata })
		}		
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unexpected error'
        console.error('Error scraping URL:', normalizedUrl, error)

        if (!clientAborted && !res.headersSent && res.writable) {
            const status = message.includes('timeout') ? 504 : 500
            res.status(status).json({ message })
        }
    } finally {
        // clearTimeout(timeout)
    }
}

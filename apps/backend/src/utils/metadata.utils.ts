// apps/backend/src/utils/metadata.utils.ts

import fetch from 'node-fetch'
import { getContent } from './puppeteer.utils'
import crypto from 'crypto'

export class ScrapeError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'ScrapeError'
	}
}

const metascraper = require('metascraper')([
    require('metascraper-description')({ truncateLength: 200 }),
    require('metascraper-image')(),
    require('metascraper-title')()
])

interface OEmbedResponse { title: string; thumbnail_url: string }

const getAppSecretProof = (accessToken: string, appSecret: string) =>
    crypto.createHmac('sha256', appSecret).update(accessToken).digest('hex')

const normalizeUrl = (url: string): string => {
    try {
        const u = new URL(url)
        if (u.hostname.startsWith('m.')) u.hostname = u.hostname.replace(/^m\./, 'www.')
        return u.toString()
    } catch {
        throw new Error(`Invalid URL: ${url}`)
    }
}

const getOEmbedProviders = () => ([
    { regex: /youtube\.com|youtu\.be/, endpoint: 'https://www.youtube.com/oembed', requiresAuth: false },
    { regex: /instagram\.com/, endpoint: 'https://graph.facebook.com/v23.0/instagram_oembed', requiresAuth: true, accessToken: process.env.INSTAGRAM_ACCESS_TOKEN },
    { regex: /facebook\.com/, endpoint: 'https://graph.facebook.com/v23.0/oembed_post', requiresAuth: true, accessToken: process.env.FACEBOOK_ACCESS_TOKEN },
])

const findOEmbedProvider = (url: string) => getOEmbedProviders().find(p => p.regex.test(url))

const fetchOEmbed = async (url: string) => {
	const provider = findOEmbedProvider(url)
	if (!provider) return undefined  // <-- changed from null

	let oembedUrl = `${provider.endpoint}?url=${encodeURIComponent(url)}&format=json`

	if (provider.requiresAuth) {
		const accessToken = process.env.TEMP_ACCESS_TOKEN
		const appSecret = process.env.FACEBOOK_APP_SECRET
		if (!accessToken || !appSecret) {
			throw new ScrapeError('App credentials missing for oEmbed')
		}
		const appSecretProof = getAppSecretProof(accessToken, appSecret)
		oembedUrl += `&access_token=${accessToken}&appsecret_proof=${appSecretProof}`
	}

	try {
		const res = await fetch(oembedUrl)
		const rawText = await res.text()
		if (!res.ok) {
			const errorText = await res.text()
			console.error('oEmbed fetch failed:', res.status, errorText)
			throw new ScrapeError(`oEmbed fetch failed: ${res.status}`)
		}
		const data: OEmbedResponse = JSON.parse(rawText)
		return {
			title: data.title || '',
			description: '',
			image: data.thumbnail_url || '',
		}
	} catch (err: any) {
		if (err.name === 'FetchError') {
			throw new ScrapeError('Network error during oEmbed fetch')
		}
		// Return undefined on fetch error instead of throwing?
		// Or keep throw, depending on your error handling preference
		throw err
	}
}

export const scrapeMetadata = async (url: string) => {
	let normalizedUrl: string
	try {
		normalizedUrl = normalizeUrl(url)
	} catch {
		throw new ScrapeError(`Invalid URL: ${url}`)
	}

	try {
		const hasProvider = findOEmbedProvider(normalizedUrl)

		// Try oEmbed first
		let metadata = hasProvider ? await fetchOEmbed(normalizedUrl) : undefined  // <-- changed from null

		// If oEmbed fails or lacks title, fallback to scraping
		if (!metadata?.title) {
			const { html } = await getContent(normalizedUrl)
			metadata = await metascraper({ html, url: normalizedUrl })
		}

		// If metadata is empty or no useful data, return undefined
		if (!metadata || (!metadata.title && !metadata.description && !metadata.image)) {
			return undefined
		}

		return metadata
	} catch (err: any) {
		if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
			throw new ScrapeError('Host not found or unreachable')
		}

		if (err.message?.includes('timeout')) {
			throw new ScrapeError('Request timed out')
		}

		if (err.message?.includes('Failed to fetch oEmbed')) {
			throw new ScrapeError('Could not fetch oEmbed metadata')
		}

		throw new ScrapeError(`Failed to scrape metadata for ${url}`)
	}
}

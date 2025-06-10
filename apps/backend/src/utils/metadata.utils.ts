// apps/backend/src/utils/metadata.utils.ts

import fetch from 'node-fetch'
import { getContent } from './puppeteer.utils'
import crypto from 'crypto'
const metascraper = require('metascraper')([
    require('metascraper-description')(),
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
    if (!provider) return null

    let oembedUrl = `${provider.endpoint}?url=${encodeURIComponent(url)}&format=json`
    if (provider.requiresAuth) {
        const accessToken = process.env.TEMP_ACCESS_TOKEN
        const appSecret = process.env.FACEBOOK_APP_SECRET
        if (!accessToken || !appSecret) throw new Error('App credentials missing')

        const appSecretProof = getAppSecretProof(accessToken, appSecret)
        oembedUrl += `&access_token=${accessToken}&appsecret_proof=${appSecretProof}`
    }

    const res = await fetch(oembedUrl)
    const rawText = await res.text()
    if (!res.ok) throw new Error(`Failed to fetch oEmbed: ${res.status}`)

    const data: OEmbedResponse = JSON.parse(rawText)
    return { title: data.title || '', description: '', image: data.thumbnail_url || '' }
}

export const scrapeMetadata = async (url: string) => {
    const normalizedUrl = normalizeUrl(url)
    let metadata = findOEmbedProvider(normalizedUrl) ? await fetchOEmbed(normalizedUrl) : null
    if (!metadata?.title) {
        const { html } = await getContent(normalizedUrl)
        metadata = await metascraper({ html, url: normalizedUrl })
    }
    return metadata
} 

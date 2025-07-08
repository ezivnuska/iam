// apps/backend/src/utils/puppeteer.utils.ts

import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// import type { Page } from 'puppeteer'

puppeteer.use(StealthPlugin())

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getContent = async (
	url: string,
	maxRetries = 3
): Promise<{ html: string; url: string }> => {
	let lastError: unknown
	const visited = new Set<string>()

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		let browser
		try {
			browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox']
			})

			const page = await browser.newPage()

			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0'
			)

			await page.setRequestInterception(true)
			page.on('request', req => {
				const blockTypes = ['image', 'stylesheet', 'font', 'media']
				blockTypes.includes(req.resourceType()) ? req.abort() : req.continue()
			})

			visited.add(url)
			await page.goto(url, { timeout: 90000, waitUntil: 'domcontentloaded' })

			const canonical = await page
				.$eval('link[rel="canonical"]', el => el.getAttribute('href'))
				.catch(() => null)

			const finalUrl =
				canonical && canonical !== url && !visited.has(canonical) ? canonical : url

			if (finalUrl !== url) {
				await page.goto(finalUrl, { timeout: 90000, waitUntil: 'domcontentloaded' })
			}

			const html = await page.content()
			return { html, url: finalUrl }
		} catch (err) {
			lastError = err
			await delay(1000 * 2 ** attempt)
		} finally {
			if (browser) await browser.close()
		}
	}

	throw new Error(`Failed to load URL: ${url}\nError: ${lastError}`)
}

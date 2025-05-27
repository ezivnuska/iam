// apps/web/src/utils/url.ts

export const extractFirstUrl = (text: string): string | null => {
	const urlRegex = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi
	const match = text.match(urlRegex)
	if (!match) return null

	let url = match[0]

	if (!url.startsWith('http')) {
		url = 'https://' + url
	}

	return url
}

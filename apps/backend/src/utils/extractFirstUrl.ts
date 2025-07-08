// apps/backend/src/utils/extractFirstUrl.ts

export const extractFirstUrl = (text: string): string | null => {
	const urlRegex = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi
    let url = null
    
    const matches = text.match(urlRegex)
    if (matches?.length) url = matches[0]

	if (url && !url?.startsWith('http')) {
		url = 'https://' + url
	}

	return url
}

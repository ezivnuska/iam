// apps/backend/src/types/youtube-meta-data.d.ts

declare module 'youtube-meta-data' {
	interface EmbedInfo {
		title: string
		author_name: string
		author_url: string
		type: string
		height: number
		width: number
		version: string
		provider_name: string
		provider_url: string
		thumbnail_height: number
		thumbnail_width: number
		thumbnail_url: string
		html: string
	}

	interface YouTubeMetadata {
		title: string
		description?: string
		keywords?: string
		shortlinkUrl?: string | null
		videourl?: string | null
		embedinfo: EmbedInfo | null
	}

	const getMetadata: (url: string) => Promise<YouTubeMetadata>
	export default getMetadata
}

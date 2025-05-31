// aps/web/src/hooks/useLinkPreviewQueue.ts

import { useCallback, useEffect, useRef, useState } from 'react'

type ScrapeJob = {
	id: string
	url: string
	callback: () => void
}

export function useLinkPreviewQueue(maxConcurrency: number = 2) {
	const queue = useRef<ScrapeJob[]>([])
	const activeCount = useRef(0)
	const seenIds = useRef<Set<string>>(new Set())
	const [renderableIds, setRenderableIds] = useState<Set<string>>(new Set())

	const processQueue = useCallback(() => {
		if (activeCount.current >= maxConcurrency || queue.current.length === 0) {
			return
		}

		const job = queue.current.shift()
		if (!job) return

		activeCount.current++

		fetch('/api/scrape', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: job.url }),
		})
			.then(() => {
				setRenderableIds(prev => {
					const next = new Set(prev)
					next.add(job.id)
					return next
				})
				job.callback?.()
			})
			.catch(err => {
				console.warn(`Failed to scrape ${job.url}`, err)
			})
			.finally(() => {
				activeCount.current--
				processQueue()
			})
	}, [maxConcurrency])

	const enqueue = useCallback((id: string, url: string, callback: () => void) => {
		if (seenIds.current.has(id)) return
		seenIds.current.add(id)

		queue.current.push({ id, url, callback })
		processQueue()
	}, [processQueue])

	const shouldRender = useCallback((id: string) => {
		return renderableIds.has(id)
	}, [renderableIds])

	// Optional: ensure queue processing is triggered if new jobs appear
	useEffect(() => {
		if (activeCount.current < maxConcurrency && queue.current.length > 0) {
			processQueue()
		}
	}, [processQueue, maxConcurrency])

	return { enqueue, shouldRender }
}

// aps/web/src/hooks/useLinkPreviewQueue.ts

import { useCallback, useRef, useState } from 'react'

type ScrapeJob = {
	id: string
	url: string
	callback: () => void
}

export function useLinkPreviewQueue(maxConcurrency = 2) {
	const queue = useRef<ScrapeJob[]>([])
	const activeCount = useRef(0)
	const seenIds = useRef<Set<string>>(new Set())
	const [renderableIds, setRenderableIds] = useState<Set<string>>(new Set())
	const isProcessing = useRef(false)

	const processQueue = useCallback(() => {
		if (isProcessing.current) return
		isProcessing.current = true

		const tick = async () => {
			while (queue.current.length > 0 && activeCount.current < maxConcurrency) {
				const job = queue.current.shift()
				if (!job) break

				activeCount.current++

				try {
					await fetch('/api/posts/scrape', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ url: job.url }),
					})

					setRenderableIds((prev) => {
						const next = new Set(prev)
						next.add(job.id)
						return next
					})

					job.callback?.()
				} catch (err) {
					console.warn(`Failed to scrape ${job.url}`, err)
				} finally {
					activeCount.current--
				}
			}
			isProcessing.current = false
			if (queue.current.length > 0) {
				processQueue()
			}
		}

		tick()
	}, [maxConcurrency])

	const enqueue = useCallback(
		(id: string, url: string, callback: () => void) => {
			if (seenIds.current.has(id)) {
				console.log(`Skip enqueue, already seen: ${id}`)
				return
			}
			console.log(`Enqueue: ${id} -> ${url}`)
			seenIds.current.add(id)
			queue.current.push({ id, url, callback })
			processQueue()
		},
		[processQueue]
	)	  

	const shouldRender = useCallback(
		(id: string) => renderableIds.has(id),
		[renderableIds]
	)

	return { enqueue, shouldRender }
}

// aps/web/src/hooks/useLinkPreviewQueue.ts

import React, { useCallback, useRef, useState } from 'react'

export const useLinkPreviewQueue = (maxConcurrent: number = 2) => {
	const queue = useRef<{ id: string; url: string; done: () => void }[]>([])
	const active = useRef<Set<string>>(new Set())
	const canRender = useRef<Set<string>>(new Set())

	const processQueue = () => {
		while (active.current.size < maxConcurrent && queue.current.length > 0) {
			const next = queue.current.shift()
			if (next) {
				active.current.add(next.id)
				next.done()
			}
		}
	}

	const enqueue = useCallback((id: string, url: string, done: () => void) => {
		if (canRender.current.has(id)) return
	
		queue.current.push({
			id,
			url,
			done: () => {
				active.current.add(id)
	
				canRender.current.add(id)
				done()
	
				active.current.delete(id)
				processQueue()
			},
		})
	
		processQueue()
	}, [])

	const shouldRender = useCallback((id: string) => {
		return canRender.current.has(id)
	}, [])	

	return { enqueue, shouldRender }
}

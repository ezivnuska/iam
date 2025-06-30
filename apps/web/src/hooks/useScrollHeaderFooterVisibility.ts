// apps/web/src/hooks/useScrollHeaderFooterVisibility.ts

import { useRef, useCallback } from 'react'
import type { AnimatedPageLayoutHandles } from '@/components'

export const useScrollHeaderFooterVisibility = () => {
	const pageLayoutRef = useRef<AnimatedPageLayoutHandles>(null)

	const onLayoutTrigger = useCallback((direction: 'up' | 'down') => {
		if (direction === 'down') {
			pageLayoutRef.current?.hideHeaderFooter()
		} else {
			pageLayoutRef.current?.showHeaderFooter()
		}
	}, [])

	const debouncedShowHeaderFooter = useCallback(
		debounce(() => {
			pageLayoutRef.current?.showHeaderFooter()
		}, 150),
		[]
	)

	function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
		let timeout: ReturnType<typeof setTimeout>
		return (...args: Parameters<T>) => {
			clearTimeout(timeout)
			timeout = setTimeout(() => fn(...args), delay)
		}
	}

	return {
		pageLayoutRef,
		onLayoutTrigger,
		debouncedShowHeaderFooter,
	}
}

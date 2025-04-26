// packages/services/src/hooks/usePaginatedFetch.ts

import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'

export function usePaginatedFetch<T>(endpoint: string, pageSize = 10) {
	const [data, setData] = useState<T[]>([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const fetchPage = useCallback(async () => {
		if (loading || !hasMore) return
		setLoading(true)

		try {
			const res = await api.get(`${endpoint}?page=${page}&limit=${pageSize}`)
			const newData = res.data.items || res.data.users || res.data
			setData(prev => [...prev, ...newData])
			setHasMore(newData.length === pageSize)
			setPage(prev => prev + 1)
		} catch (err) {
			console.error('Fetch error:', err)
		} finally {
			setLoading(false)
		}
	}, [page, loading, hasMore, endpoint, pageSize])

	useEffect(() => {
		fetchPage()
	}, [])

	return { data, fetchNextPage: fetchPage, loading }
}
// apps/web/src/hooks/useUsers.ts

import { useMemo } from 'react'
import { usePaginatedFetch } from '@services'
import { usePresence, useAuth } from '@/hooks'
import type { User } from '@iam/types'

export const useUsers = () => {
	const { user: currentUser } = useAuth()
	const { isOnline } = usePresence()
	const { data, fetchNextPage, loading } = usePaginatedFetch<User>('users')

	const users = useMemo(() => {
		return (data ?? []).filter((u) => u.email !== currentUser?.email)
	}, [data, currentUser?.email])

	return {
		users,
		isOnline,
		loading,
		fetchNextPage,
	}
}

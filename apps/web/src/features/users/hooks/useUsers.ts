// apps/web/src/features/users/hooks/useUsers.ts

import { useMemo } from 'react'
import { usePaginatedFetch } from '@iam/services'
import { usePresence, useAuth } from '@shared/hooks'
import type { User } from '@iam/types'

export const useUsers = () => {
	const { user: currentUser, loading: authLoading } = useAuth()
	const { isOnline } = usePresence()
	const { data, fetchNextPage, loading } = usePaginatedFetch<User>('users', 10, !authLoading)

	const users = useMemo(() => {
        const currentUsers = data ?? []
		return currentUsers.filter((u) => u.email !== currentUser?.email)
	}, [data, currentUser?.email])

	return {
		users,
		isOnline,
		loading,
		fetchNextPage,
	}
}

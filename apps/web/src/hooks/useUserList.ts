// apps/web/src/hooks/useUserList.ts

import { useUsers } from './useUsers'
import { useUserBondActions } from './useUserBondActions'

export const useUserList = () => {
	const {
		users,
		isOnline,
		loading: loadingUsers,
		fetchNextPage,
	} = useUsers()

	const {
		filter,
		setFilter,
		filteredUsers,
		getBondForUser,
		requestBond,
		confirmBond,
		deleteBondByUser,
		bondsError,
		loadingBonds,
	} = useUserBondActions(users)

	return {
		// User logic
		users,
		filteredUsers,
		isOnline,
		loadingUsers,
		fetchNextPage,

		// Bond logic
		filter,
		setFilter,
		getBondForUser,
		requestBond,
		confirmBond,
		deleteBondByUser,
		bondsError,
		loadingBonds,
	}
}

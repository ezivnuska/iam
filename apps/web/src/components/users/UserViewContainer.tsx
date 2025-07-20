// apps/web/src/components/users/UserViewContainer.tsx

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Text } from 'react-native'
import { UserView } from '@/components'
import { getUserByUsername } from '@services'
import { normalizeUser } from '@utils'
import { LoadingScreen } from '@/screens'
import type { User } from '@iam/types'

const UserProfileContext = createContext<User | null>(null)
export const useUserProfile = () => useContext(UserProfileContext)

export const UserViewContainer: React.FC<any> = ({ ...props }) => {
    
	const [fetchedUser, setFetchedUser] = useState<User | null>(null)
	const [loadingUser, setLoadingUser] = useState(false)
	const [userNotFound, setUserNotFound] = useState(false)
	const username = props.route.params.username
	const userToDisplay = useMemo(() => fetchedUser, [fetchedUser])
	
	useEffect(() => {
		const fetchUser = async () => {
			if (!username) return
			setLoadingUser(true)
			setUserNotFound(false)
			try {
				const fetched = await getUserByUsername(username)
				if (fetched) {
                    setFetchedUser(normalizeUser(fetched))
				} else {
                    setUserNotFound(true)
				}
			} catch (error) {
				console.error('[UserProfileShell] Failed to fetch user:', error)
				setUserNotFound(true)
			} finally {
				setLoadingUser(false)
			}
		}
		fetchUser()
	}, [])

	if (!username) {
		return <Text style={{ padding: 20, color: 'red' }}>Username param is required</Text>
	}

	if (loadingUser) {
		return <LoadingScreen label='Loading user profile...' />
	}

	if (userNotFound || !userToDisplay) {
		return <Text style={{ padding: 20, color: 'red' }}>User not found</Text>
	}

	return (
		<UserProfileContext.Provider value={userToDisplay}>
			<UserView user={userToDisplay} />
		</UserProfileContext.Provider>
	)
}

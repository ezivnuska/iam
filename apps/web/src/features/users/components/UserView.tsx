// apps/web/src/features/users/components/UserView.tsx

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Text } from 'react-native'
import { ScreenContainer } from '@shared/layout'
import { UserScreenHeader } from './'
import { LoadingPanel } from '@shared/ui'
import { UserProfileNavigator } from '../'
import { getUserByUsername } from '@services'
// import { normalizeUser } from '@utils'
import type { User } from '@iam/types'

const UserProfileContext = createContext<User | null>(null)
export const useUserProfile = () => useContext(UserProfileContext)

export const UserView = ({ ...props }) => {
    
    const username = props.route.params.username
    const [fetchedUser, setFetchedUser] = useState<User | null>(null)
    const [loadingUser, setLoadingUser] = useState(false)
    const [userNotFound, setUserNotFound] = useState(false)
    const userToDisplay = useMemo(() => fetchedUser, [fetchedUser])

    useEffect(() => {
        const fetchUser = async () => {
            if (!username) return
            setLoadingUser(true)
            setUserNotFound(false)
            try {
                const fetched = await getUserByUsername(username)
                if (fetched) {
                    setFetchedUser(fetched)
                    // setFetchedUser(normalizeUser(fetched))
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
    }, [username])
    
    if (!username) {
        return <Text style={{ padding: 20, color: 'red' }}>Username param is required</Text>
    }

    if (loadingUser) {
        return <LoadingPanel label='Loading user profile...' />
    }

    if (userNotFound || !userToDisplay) {
        return <Text style={{ padding: 20, color: 'red' }}>User not found</Text>
    }

	return (
        <UserProfileContext.Provider value={userToDisplay}>
            <ScreenContainer
                header={UserScreenHeader}
                screen={UserProfileNavigator}
            />
        </UserProfileContext.Provider>
	)
}

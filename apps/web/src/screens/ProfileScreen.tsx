// apps/web/src/screens/UserProfileScreen.tsx

import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import {
	Avatar,
    Button,
	Column,
	Row,
	IconButton,
    EditProfileForm,
    Screen,
} from '@/components'
import { useAuth, useModal, useTheme } from '@/hooks'
import { getUserByUsername } from '@services'
import type { User } from '@iam/types'
import { normalizeUser } from '@utils'
import { navigate } from '@/navigation'
import { LoadingScreen } from './LoadingScreen'

type DetailsParams = {
	username?: string
}

export const ProfileScreen = () => {
	const route = useRoute()
    const params = route.params as DetailsParams

    const username = useMemo(() => {
        return params?.username || undefined
    }, [params])

	const { user: authUser, logout, isAuthInitialized } = useAuth()

	const { openFormModal } = useModal()
	const { theme } = useTheme()

	const [fetchedUser, setFetchedUser] = useState<User | null>(null)
	const [loadingUser, setLoadingUser] = useState(false)
    const [userNotFound, setUserNotFound] = useState(false)

	const isOwnProfile =
	    isAuthInitialized && (username == null || authUser?.username === username)

    const userToDisplay = useMemo(() => {
        const user = isOwnProfile ? authUser : fetchedUser
        return user ? normalizeUser(user) : null
    }, [authUser, fetchedUser, isOwnProfile])

	useEffect(() => {
        const fetchUser = async () => {
            if (!username || isOwnProfile) return
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
                console.error('[UserProfileScreen] Failed to fetch user by username:', error)
                setUserNotFound(true)
            } finally {
                setLoadingUser(false)
            }
        }
    
        if (!isOwnProfile) {
            fetchUser()
        }
    }, [username, isOwnProfile])
    
	const openEditModal = () => {
		openFormModal(EditProfileForm, {}, { title: 'Edit Bio' })
	}

    const gotToImages = () => navigate('Images' as never)

    if (!isAuthInitialized) {
        return <LoadingScreen label='Authenticating...' />
    }

    if (userNotFound) {
        return <Text style={{ color: 'red', padding: 20 }}>User not found</Text>
    }

    if (typeof isOwnProfile === 'undefined') {
        return <LoadingScreen label='Loading profile...' />
    }
    
    if (isOwnProfile && (!authUser || !authUser.username)) {
        return <LoadingScreen label='Loading your profile...' />
    }
    
    if (!isOwnProfile && (loadingUser || !fetchedUser)) {
        return <LoadingScreen label='Loading user profile...' />
    }

	if (loadingUser || !userToDisplay) {
		return <LoadingScreen label='Loading user...' />
	}

	return (
        <Screen>
            <Column
                flex={1}
                spacing={15}
            >
                <Row>
                    <Row flex={1} spacing={15} align='center'>
                        <Avatar user={userToDisplay} size='md' />
                        <Column spacing={5}>
                            <Text style={{ fontSize: 32, fontWeight: 600, color: theme.colors.text }}>
                                {userToDisplay.username}
                            </Text>
                            {/* <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                                {userToDisplay.email}
                            </Text> */}
                        </Column>
                    </Row>
                    {isOwnProfile && (
                        <Button
                            label='Sign Out'
                            onPress={logout}
                            variant='muted'
                        />
                    )}
                </Row>

                <Row spacing={10}>
                    <Text style={[styles.text, { color: theme.colors.text }]}>
                        {userToDisplay.bio || 'No bio yet.'}
                    </Text>
                    {isOwnProfile && (
                        <IconButton
                            onPress={openEditModal}
                            iconName='create-outline'
                            iconSize={28}
                        />
                    )}
                </Row>
                
                <Button label='Images' onPress={gotToImages} />

                {/* <UserImageSection userId={currentUserId} /> */}
            </Column>
        </Screen>
	)
}

// const UserImageSection = ({ userId }: { userId?: string }) => {
    
//     if (!userId) {
//         console.warn('Invalid userId passed to UserImageSection:', userId)
//         return null
//     }

// 	return (
// 		<View style={{ flex: 1 }}>
// 			<ImageProvider userId={userId}>
// 				<ImageGalleryContainer userId={userId} />
// 			</ImageProvider>
// 		</View>
// 	)
// }

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		textAlign: 'left',
		flex: 1,
	},
	username: {
		fontWeight: 'bold',
	},
	editButton: {
		marginLeft: 10,
	},
})

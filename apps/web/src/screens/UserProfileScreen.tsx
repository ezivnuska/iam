// apps/web/src/screens/UserProfileScreen.tsx

import React, { useEffect, useState, useMemo } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useRoute } from '@react-navigation/native'
import {
	Avatar,
	Column,
    EditProfileForm,
	PageLayout,
	Row,
	Spinner,
	UserImageManager,
	IconButton,
} from '@/components'
import { useAuth, useModal } from '@/hooks'
import { getUserByUsername } from '@services'
import { ImageProvider } from '@/providers'
import type { User } from '@iam/types'
import { Feather } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { paddingHorizontal, Size } from '@/styles'
import { normalizeUser } from '@utils'

type DetailsParams = {
	username?: string
}

export const UserProfileScreen = () => {
	const route = useRoute()
    const params = route.params as DetailsParams

    const username = useMemo(() => {
        return params?.username || null
    }, [params])

	const { user: authUser, logout, isAuthInitialized } = useAuth()

    if (!isAuthInitialized) {
        return <Spinner label='Authenticating...' />
    }

	const { openFormModal } = useModal()

	const [fetchedUser, setFetchedUser] = useState<User | null>(null)
	const [loadingUser, setLoadingUser] = useState(false)
    const [userNotFound, setUserNotFound] = useState(false)

	const isOwnProfile =
	    isAuthInitialized && (username == null || authUser?.username === username)

    const userToDisplay = useMemo(() => {
        const user = isOwnProfile ? authUser : fetchedUser
        return user ? normalizeUser(user) : null
    }, [authUser, fetchedUser, isOwnProfile])

    const currentUserId = useMemo(() => userToDisplay?.id, [userToDisplay?.id])

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

    if (userNotFound) {
        return <Text style={{ color: 'red', padding: 20 }}>User not found</Text>
    }

    if (typeof isOwnProfile === 'undefined') {
        return <Spinner label='Loading profile...' />
    }
    
    if (isOwnProfile && (!authUser || !authUser.username)) {
        return <Spinner label='Loading your profile...' />
    }
    
    if (!isOwnProfile && (loadingUser || !fetchedUser)) {
        return <Spinner label='Loading user profile...' />
    }
    
	const openEditModal = () => {
		openFormModal(EditProfileForm, {}, { title: 'Edit Bio' })
	}

	if (loadingUser || !userToDisplay) {
		return <Spinner label='Loading user...' />
	}

	return (
		<PageLayout>
			<Column
				// paddingVertical={Size.S}
				paddingHorizontal={paddingHorizontal}
				flex={1}
				spacing={15}
			>
				<Row>
					<Row flex={1} spacing={15}>
						<Avatar user={userToDisplay} size='lg' />
						<Column spacing={5}>
							<Text style={[styles.text, styles.username]}>
								{userToDisplay.username}
							</Text>
							<Text style={[styles.text, styles.email]}>
								{userToDisplay.email}
							</Text>
						</Column>
					</Row>
					{isOwnProfile && (
						<IconButton
							icon={<Ionicons name='exit-outline' size={Size.L} color='#777' />}
							label='Sign Out'
							onPress={logout}
							showLabel
						/>
					)}
				</Row>

				<Row spacing={10}>
					<Text style={styles.text}>
						{userToDisplay.bio || 'No bio yet.'}
					</Text>
					{isOwnProfile && (
						<Pressable onPress={openEditModal} style={styles.editButton}>
							<Feather name='edit-3' size={18} color='#eee' />
						</Pressable>
					)}
				</Row>

				<UserImageSection userId={currentUserId} />
			</Column>
		</PageLayout>
	)
}

const UserImageSection = ({ userId }: { userId?: string }) => {
    
    if (!userId) {
        console.warn('Invalid userId passed to UserImageSection:', userId)
        return null
    }

	return (
		<View style={{ flex: 1 }}>
			<ImageProvider userId={userId}>
				<UserImageManager userId={userId} />
			</ImageProvider>
		</View>
	)
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		textAlign: 'left',
		color: '#eee',
		flex: 1,
	},
	username: {
		fontWeight: 'bold',
	},
	email: {
		color: '#0cc',
	},
	editButton: {
		marginLeft: 10,
	},
})

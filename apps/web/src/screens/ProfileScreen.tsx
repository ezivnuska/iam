// apps/web/src/screens/ProfileScreen.tsx

import React from 'react'
import { Image, StyleSheet, Text, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { EditProfileForm, PageHeader, PageLayout, ProfileImage, Column, UserImageManager } from '@/components'
import { useAuth, useModal } from '../hooks'
import { Feather } from '@expo/vector-icons'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type ProfileScreenNavProp = StackNavigationProp<RootStackParamList, 'Profile'>

export const ProfileScreen = () => {
	const { user } = useAuth()
	const navigation = useNavigation<ProfileScreenNavProp>()
	const { showModal } = useModal()

	const openEditModal = () => {
        console.log('Editing', user)
		showModal(<EditProfileForm />)
	}
    
    if (!user) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        )
    }

	return (
		<PageLayout>
			<PageHeader title={`${user.username || 'Profile'}`} />
			<Column spacing={10} align='flex-start'>
				<Text style={[styles.text, styles.username]}>{user?.username}</Text>
				<Text style={[styles.text, styles.email]}>{user?.email}</Text>
                <ProfileImage
                    url={user.avatar?.url}
                    username={user.username}
                />
                {/* {user?.avatar && (
                    <Image
                        source={{ uri: user.avatar.url }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                )} */}
				<View style={styles.sectionContainer}>
					<Text style={styles.text}>{user?.bio || 'No bio yet.'}</Text>
					<Pressable onPress={openEditModal} style={styles.editButton}>
						<Feather name='edit-3' size={18} color='#555' />
					</Pressable>
				</View>
				<View style={styles.sectionContainer}>
                    <UserImageManager />
                </View>
			</Column>
		</PageLayout>
	)
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		textAlign: 'left',
	},
	username: {
		fontWeight: 'bold',
	},
	email: {
		color: '#77f',
	},
	editButton: {
        marginLeft: 10,
	},
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	loadingText: {
		fontSize: 18,
		color: '#888',
	},
})
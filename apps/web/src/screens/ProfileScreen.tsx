// apps/web/src/screens/ProfileScreen.tsx

import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
    EditProfileForm,
    PageLayout,
    ProfileImage,
    Column,
    UserImageManager,
    Row,
} from '@/components'
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
            <Column
                paddingVertical={15}
                flex={1}
                spacing={15}
            >
                <Row spacing={15}>
                    <ProfileImage
                        user={user}
                        size='lg'
                    />
                    <Column spacing={5}>
                        <Text style={[styles.text, styles.username]}>{user?.username}</Text>
                        <Text style={[styles.text, styles.email]}>{user?.email}</Text>
                    </Column>
                </Row>
                <Row spacing={10}>
                    <Text style={styles.text}>{user?.bio || 'No bio yet.'}</Text>
                    <Pressable onPress={openEditModal} style={styles.editButton}>
                        <Feather name='edit-3' size={18} color='#555' />
                    </Pressable>
                </Row>
                <UserImageManager />
            </Column>
		</PageLayout>
	)
}

const styles = StyleSheet.create({
	text: {
        flex: 1,
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
        borderWidth: 1,
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
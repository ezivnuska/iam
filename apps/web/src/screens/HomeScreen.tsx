// packages/screens/src/screens/HomeScreen.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Column, CreatePostForm, PageHeader, PageLayout, PostList, Row } from '@/components'
import { useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAuth } from '../hooks'

export const HomeScreen = () => {
    
    const [reloadKey, setReloadKey] = React.useState(0)
    
    const { user, isAuthenticated } = useAuth()
    const { showModal } = useModal()

    const openCreatePostModal = () => {
        showModal(<CreatePostForm onPostCreated={() => setReloadKey((k) => k + 1)} />)
    }

	return (
		<PageLayout>
            <PageHeader title='Home' />
		</PageLayout>
	)
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: '600',
        color: '#111',
    },
})
// screens/FeedScreen.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Column, CreatePostForm, PageLayout, PostList, Row } from '@/components'
import { useAuth, useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Size } from '@/styles'

export const FeedScreen = () => {

    const [reloadKey, setReloadKey] = React.useState(0)
    
    const { isAuthenticated } = useAuth()
    const { showModal } = useModal()

    const openCreatePostModal = () => {
        showModal(<CreatePostForm onPostCreated={() => setReloadKey((k) => k + 1)} />)
    }

	return (
        <PageLayout>
            <Column paddingVertical={15} spacing={15}>
                <Row spacing={10} paddingHorizontal={Size.M}>
                    <Text style={styles.title}>Feed</Text>
                    {isAuthenticated && (
                        <Pressable onPress={openCreatePostModal}>
                            <Ionicons name='add-circle-outline' size={30} color='black' />
                        </Pressable>
                    )}
                </Row>
                <PostList key={reloadKey} />
            </Column>
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
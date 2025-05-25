// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Column, CreatePostForm, PageLayout, PostList, Row } from '@/components'
import { useAuth, useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Size } from '@/styles'

export const HomeScreen = () => {

    const [reloadKey, setReloadKey] = React.useState(0)
        
    const { isAuthenticated } = useAuth()
    const { showModal } = useModal()

    const openCreatePostModal = () => {
        showModal(<CreatePostForm onPostCreated={() => setReloadKey((k) => k + 1)} />)
    }

    return (
        <PageLayout>
            <Column>
                {isAuthenticated && (
                    <Pressable onPress={openCreatePostModal}>
                        <Row justify='flex-end' spacing={10} paddingVertical={Size.S} paddingHorizontal={Size.M}>
                            <Text style={styles.postButton}>Add Post</Text>
                            <Ionicons name='add-circle-outline' size={30} color='black' />
                        </Row>
                    </Pressable>
                )}
                <PostList key={reloadKey} />
            </Column>
        </PageLayout>
    )
}

const styles = StyleSheet.create({
    postButton: {
        fontSize: 20,
        fontWeight: '500',
        color: '#111',
    },
})
// screens/FeedScreen.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Column, CreatePostForm, PostList, Row } from '@/components'
import { useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'

export const FeedScreen = () => {

    const [reloadKey, setReloadKey] = React.useState(0)
    
    const { showModal } = useModal()

    const openCreatePostModal = () => {
        showModal(<CreatePostForm onPostCreated={() => setReloadKey((k) => k + 1)} />)
    }

	return (
		<Column paddingVertical={20} spacing={15}>
            <Row spacing={10}>
                <Text style={styles.title}>Feed</Text>
                <Pressable onPress={openCreatePostModal}>
                    <Ionicons name='add-circle-outline' size={30} color='black' />
                </Pressable>
            </Row>
			<PostList key={reloadKey} />
		</Column>
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
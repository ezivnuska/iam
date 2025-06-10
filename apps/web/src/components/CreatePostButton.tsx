// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { CreatePostForm } from '@/components'
import { useModal } from '@/hooks'
import { form as formStyles, shadows, Size } from '@/styles'

interface CreatePostButtonProps {
    onPostCreated?: () => void
}

export const CreatePostButton = ({ onPostCreated }: CreatePostButtonProps) => {
    const { showModal } = useModal()

    const handlePostCreated = onPostCreated ?? (() => {})

    const openCreatePostModal = () => {
        showModal(<CreatePostForm onPostCreated={handlePostCreated} />)
    }
    return (
        <Pressable
            onPress={openCreatePostModal}
            style={styles.container}
        >
            <Text style={[formStyles.input, shadows.input, styles.createPostButton]}>
                Share something...
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Size.M,
    },
    createPostButton: {
        color: '#aaa',
        paddingVertical: Size.S,
        fontSize: 20,
    },
})
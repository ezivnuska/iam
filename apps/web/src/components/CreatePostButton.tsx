// apps/web/src/components/CreatePostButton.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { CreatePostForm } from '@/components'
import { useModal } from '@/hooks'
import { form as formStyles, paddingHorizontal, shadows, Size } from '@/styles'

interface CreatePostButtonProps {
    onPostCreated?: () => void
}

export const CreatePostButton = ({ onPostCreated }: CreatePostButtonProps) => {
    const { openFormModal } = useModal()

    const openCreatePostModal = () => {
        openFormModal(CreatePostForm, { onPostCreated }, { title: 'Create Post' })
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
        paddingHorizontal: paddingHorizontal,
    },
    createPostButton: {
        color: '#aaa',
        paddingVertical: Size.S,
        fontSize: 20,
    },
})
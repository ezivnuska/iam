// apps/web/src/components/ImageComments.tsx

import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import type { Comment } from '@iam/types'
import { deleteComment, fetchComments } from '@services'
import { Size } from '@/styles'
import { Column, Row } from './'
import Ionicons from '@expo/vector-icons/Ionicons'

type ImageCommentsProps = {
    refId: string
    onCommentDeleted?: () => void
}

export const ImageComments = ({ refId, onCommentDeleted }: ImageCommentsProps) => {
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [deletingIds, setDeletingIds] = useState<string[]>([])

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchComments(refId, 'Image')
                setComments(data)
            } catch (err) {
                console.error('Failed to load image comments:', err)
            } finally {
                setLoading(false)
            }
        }
      
        loadComments()
    }, [refId])

    const handleDelete = async (id: string) => {
        setDeletingIds((prev) => [...prev, id])
        try {
            await deleteComment(id)
            setComments((prev) => prev?.filter((c) => c._id !== id) || null)
            onCommentDeleted?.()
        } catch (err) {
            console.error('Failed to delete comment:', err)
        } finally {
            setDeletingIds((prev) => prev.filter((delId) => delId !== id))
        }
    }    

    if (loading) {
        return (
            <View style={{ padding: Size.M }}>
                <ActivityIndicator size='small' />
            </View>
        )
    }

    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
                const isDeleting = deletingIds.includes(item._id)
                return (
                    <Row
                        spacing={Size.S}
                        paddingHorizontal={Size.M}
                        style={{ opacity: isDeleting ? 0.5 : 1 }}
                    >
                        <Column flex={1} spacing={Size.S}>
                            <Text style={[styles.text, styles.author]}>{item.author.username}</Text>
                            <Text style={styles.text}>{item.content}</Text>
                        </Column>
                        <Pressable
                            onPress={() => handleDelete(item._id)}
                            disabled={isDeleting}
                        >
                            <Ionicons name='trash-bin' size={20} color='white' />
                        </Pressable>
                    </Row>
                )
            }}
        />
    )
}

const styles = StyleSheet.create({
    author: {
        fontWeight: 700,
    },
    text: {
        color: '#fff',
    },
})
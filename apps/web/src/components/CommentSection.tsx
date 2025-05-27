// apps/web/src/components/CommentSection.tsx

import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ActivityIndicator } from 'react-native'
import type { Comment } from '@iam/types'
import { fetchComments } from '@services'
import { Size } from '@/styles'

type CommentSectionProps = {
    postId: string
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchComments(postId)
                setComments(data)
            } catch (err) {
                console.error('Failed to load comments:', err)
            } finally {
                setLoading(false)
            }
        }

        loadComments()
    }, [postId])

    if (loading) {
        return (
            <View style={{ padding: Size.M }}>
                <ActivityIndicator size="small" />
            </View>
        )
    }

    if (!comments?.length) {
        return (
            <View style={{ padding: Size.M }}>
                <Text>No comments yet.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <View style={{ padding: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.author.username}</Text>
                    <Text>{item.content}</Text>
                </View>
            )}
        />
    )
}

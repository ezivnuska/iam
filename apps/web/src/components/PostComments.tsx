// apps/web/src/components/PostComments.tsx

import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ActivityIndicator } from 'react-native'
import type { Comment } from '@iam/types'
import { fetchComments } from '@services'
import { Size } from '@/styles'
import { Column } from './Layout'

type PostCommentsProps = {
    refId: string
}  

export const PostComments = ({ refId }: PostCommentsProps) => {
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchComments(refId, 'Post')
                setComments(data)
            } catch (err) {
                console.error('Failed to load comments:', err)
            } finally {
                setLoading(false)
            }
        }
      
        loadComments()
    }, [refId])

    if (loading) {
        return (
            <View style={{ padding: Size.M }}>
                <ActivityIndicator size="small" />
            </View>
        )
    }

    if (!comments?.length) {
        return (
            <View style={{ paddingVertical: Size.S, paddingHorizontal: Size.M }}>
                <Text>No comments yet.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <Column spacing={Size.S} paddingHorizontal={Size.M}>
                    <Text style={{ fontWeight: 'bold' }}>{item.author.username}</Text>
                    <Text>{item.content}</Text>
                </Column>
            )}
        />
    )
}

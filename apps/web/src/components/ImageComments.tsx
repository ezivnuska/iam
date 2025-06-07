// apps/web/src/components/ImageComments.tsx

import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import type { Comment } from '@iam/types'
import { fetchComments } from '@services'
import { Size } from '@/styles'
import { Column } from './Layout'

type ImageCommentsProps = {
    refId: string
}  

export const ImageComments = ({ refId }: ImageCommentsProps) => {
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [loading, setLoading] = useState(true)

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
                <Text style={styles.text}>No comments yet.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <Column spacing={Size.S} paddingHorizontal={Size.M}>
                    <Text style={[styles.text, styles.author]}>{item.author.username}</Text>
                    <Text style={[styles.text]}>{item.content}</Text>
                </Column>
            )}
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
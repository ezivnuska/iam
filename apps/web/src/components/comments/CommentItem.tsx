// apps/web/src/components/CommentItem.tsx

import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { Avatar, Column, Row } from '@/components'
import { Comment, PartialUser } from '@iam/types'
import { paddingHorizontal, Size } from '@iam/theme'
import Ionicons from '@expo/vector-icons/Ionicons'

type CommentItemProps = {
	comment: Comment
	isAuthor: boolean
	isDeleting: boolean
	onDelete: (id: string) => void
	textColor?: string
	authorTextWeight?: string | number
	paddingVertical?: number
}

export const CommentItem = ({
	comment,
	isAuthor,
	isDeleting,
	onDelete,
	textColor = '#fff',
	authorTextWeight = '700',
	paddingVertical = Size.S,
}: CommentItemProps) => {
	return (
		<Row
			spacing={Size.S}
			paddingHorizontal={paddingHorizontal}
			align='flex-start'
            justify='flex-start'
            paddingVertical={paddingVertical}
			style={{ opacity: isDeleting ? 0.5 : 1 }}
		>
            <Avatar
                user={comment.author as PartialUser}
                size='xs'
            />
            <Row
                flex={1}
                spacing={Size.S}
                align='flex-start'
                style={{ opacity: isDeleting ? 0.5 : 1 }}
            >
                <Column flex={1} spacing={Size.XS}>
                    <Text style={[styles.author, { color: textColor, fontWeight: authorTextWeight as any }]}>
                        {comment.author.username}
                    </Text>
                    <Text style={[styles.text, { color: textColor }]}>{comment.content}</Text>
                </Column>
                {isAuthor && (
                    <Pressable onPress={() => onDelete(comment._id)} disabled={isDeleting}>
                        {isDeleting
                            ? <ActivityIndicator size={20} color='#fff' />
                            : <Ionicons name='trash-bin' size={20} color={textColor} />
                        }
                    </Pressable>
                )}
            </Row>
        </Row>
	)
}

const styles = StyleSheet.create({
    author: {
        fontSize: 20,
	},
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
	text: {},
})

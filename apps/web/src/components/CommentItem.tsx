// apps/web/src/components/CommentItem.tsx

import React from 'react'
import { Image, Text, Pressable, StyleSheet, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Comment, PartialUser } from '@iam/types'
import { Column, ProfileImage, Row } from '@/components'
import { getAvatarPlaceholder } from '@/utils'
import { Size } from '@/styles'

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
	textColor = '#000',
	authorTextWeight = '700',
	paddingVertical = Size.S,
}: CommentItemProps) => {
	return (
		<Row
			spacing={Size.S}
			paddingHorizontal={Size.M}
			align='flex-start'
            justify='flex-start'
            paddingVertical={paddingVertical}
			style={{ opacity: isDeleting ? 0.5 : 1 }}
		>
            {comment.author.avatar ? (
                <ProfileImage user={comment.author as PartialUser} size='xs' />
            ) : (
                <Image
                    source={{ uri: getAvatarPlaceholder(comment.author.username) }}
                    style={styles.avatar}
                />
            )}
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
                        <Ionicons name='trash-bin' size={20} color={textColor} />
                    </Pressable>
                )}
            </Row>
        </Row>
	)
}

const styles = StyleSheet.create({
    author: {
        fontSize: 20,
        // lineHeight: 40,
	},
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
	text: {},
})

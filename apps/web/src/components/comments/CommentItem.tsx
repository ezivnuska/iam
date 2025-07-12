// apps/web/src/components/CommentItem.tsx

import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Avatar, Column, IconButton, Row } from '@/components'
import { Comment, PartialUser } from '@iam/types'
import { paddingHorizontal, Size } from '@iam/theme'
import { useTheme } from '@/hooks'

type CommentItemProps = {
	comment: Comment
	isAuthor: boolean
	isDeleting: boolean
	onDelete: (id: string) => void
	paddingVertical?: number
}

export const CommentItem = ({
	comment,
	isAuthor,
	isDeleting,
	onDelete,
	paddingVertical = Size.S,
}: CommentItemProps) => {
    const { theme } = useTheme()
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
                    <Text style={[styles.author, { color: theme.colors.text, fontWeight: 600 }]}>
                        {comment.author.username}
                    </Text>
                    <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{comment.content}</Text>
                </Column>
                {isAuthor && (
                    <View>
                        {isDeleting
                            ? <ActivityIndicator size={20} color={theme.colors.text} />
                            : <IconButton
                                iconName='trash-bin'
                                onPress={() => onDelete(comment._id)}
                                disabled={isDeleting}
                            />
                        }
                    </View>
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

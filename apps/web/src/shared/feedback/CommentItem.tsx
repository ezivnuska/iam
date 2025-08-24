// apps/web/src/shared/feedback/CommentItem.tsx

import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from '@shared/ui'
import { IconButton } from '@shared/buttons'
import { Column, Row } from '@shared/grid'
import { Comment, PartialUser } from '@iam/types'
import { Size } from '@iam/theme'
import { useTheme } from '@shared/hooks'
import Feather from '@expo/vector-icons/Feather'

type CommentItemProps = {
	comment: Comment
	isAuthor: boolean
	isDeleting: boolean
	onDelete: () => void
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
			align='flex-start'
            justify='flex-start'
            paddingBottom={paddingVertical}
			style={{ opacity: isDeleting ? 0.5 : 1 }}
		>
            <Avatar
                user={comment.author as PartialUser}
                size='xs'
                style={{ marginTop: 2 }}
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
                            // : (
                            //     <TouchableOpacity
                            //         onPress={onDelete}
                            //         disabled={isDeleting}
                            //         style={[
                            //             styles.button,
                            //             styles.cancel,
                            //             isDeleting && styles.disabled,
                            //         ]}
                            //     >
                            //         <Feather name='slash' size={30} color={isDeleting ? '#fff' : '#000'} />
                            //     </TouchableOpacity>
                            // )
                            : <IconButton
                                iconName='remove-circle'
                                onPress={onDelete}
                                disabled={isDeleting}
                                iconSize={30}
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
	text: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 500,
    },
    button: {
        borderWidth: 1,
        outlineWidth: 1,
        outlineColor: '#fff',
        height: 40,
        width: 40,
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    send: {
        backgroundColor: '#3a3',
    },
    cancel: {
        backgroundColor: '#c66',
    },
    disabled: {
        backgroundColor: '#666',
        cursor: 'pointer',
    },
})

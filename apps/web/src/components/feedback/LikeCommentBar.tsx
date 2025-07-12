// apps/web/src/components/feedback/LikeCommentBar.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Row } from '@/components'
import { paddingHorizontal, Size } from '@iam/theme'
import Ionicons from '@expo/vector-icons/Ionicons'

type Props = {
	likeCount: number
	liked: boolean
	commentCount: number
	expanded?: boolean
	isAuthenticated: boolean
	onToggleLike: () => void
	onToggleComments: () => void
	onAddComment: () => void
	disabledComment?: boolean
}

export const LikeCommentBar: React.FC<Props> = ({
	likeCount,
	liked,
	commentCount,
	expanded = false,
	isAuthenticated,
	onToggleLike,
	onToggleComments,
	onAddComment,
	disabledComment = false,
}) => {
    const commentDisabled = disabledComment || !isAuthenticated || commentCount === 0

	return (
		<Row
            flex={1}
            spacing={Size.M}
            paddingHorizontal={paddingHorizontal}
            align='center'
            justify='space-between'
            paddingVertical={Size.S}
        >
            <Pressable onPress={onToggleLike} disabled={!isAuthenticated}>
                <Row
                    spacing={Size.XS}
                    justify='center'
                    align='center'
                >
                    <Text style={[styles.bottomButton, { color: '#fff' }]}>
                        {likeCount} {`like${likeCount !== 1 ? 's' : ''}`}
                    </Text>

                    {isAuthenticated && (
                        <Ionicons
                            name={liked ? 'heart' : 'heart-outline'}
                            size={20}
                            color={liked ? 'red' : '#fff'}
                        />                      
                    )}
                </Row>
            </Pressable>

			<Pressable
				onPress={onToggleComments}
				style={{ paddingHorizontal: paddingHorizontal }}
				disabled={commentDisabled}
			>
                <Row spacing={5} align='center'>
                    <Text
                        style={[
                            styles.bottomButton,
                            { color: commentDisabled ? '#888' : '#fff' },
                        ]}
                    >
                        {commentCount} {`Comment${commentCount !== 1 ? 's' : ''}`}
                    </Text>

                    {commentCount > 0 && (
                        <Ionicons
                            name={`chevron-${expanded ? 'up' : 'down' }`}
                            size={16}
                            color='#fff'
                            style={{ marginTop: 3 }}
                        />
                    )}
                </Row>
			</Pressable>

			{isAuthenticated && (
				<Pressable onPress={onAddComment}>
					<Text style={[styles.bottomButton, { color: '#fff' }]}>Add Comment</Text>
				</Pressable>
			)}
		</Row>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 50,
	},
	bottomButton: {
		fontSize: 16,
	},
})

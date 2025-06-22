// apps/web/src/components/LikeCommentBar.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Row } from '@/components'
import { paddingHorizontal, Size } from '@/styles'
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
	textColor?: string
	iconColor?: string
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
	textColor = '#000',
	iconColor = 'gray',
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
                    <Text style={[styles.bottomButton, { color: textColor }]}>
                        {likeCount} {`like${likeCount !== 1 ? 's' : ''}`}
                    </Text>

                    {isAuthenticated && (
                        <Text style={[styles.bottomButton, { color: liked ? 'red' : iconColor }]}>
                            {liked ? '♥' : '♡'}
                        </Text>
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
                            { color: commentDisabled ? '#888' : textColor },
                        ]}
                    >
                        {commentCount} {`Comment${commentCount !== 1 ? 's' : ''}`}
                    </Text>

                    {commentCount > 0 && (
                        <Ionicons
                            name={`chevron-${expanded ? 'down' : 'up' }`}
                            size={16}
                            color='#fff'
                            style={{ marginTop: 3 }}
                        />
                    )}
                </Row>
			</Pressable>

			{isAuthenticated && (
				<Pressable onPress={onAddComment}>
					<Text style={[styles.bottomButton, { color: textColor }]}>Add Comment</Text>
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

// apps/web/src/shared/feedback/FeedbackBar.tsx

import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Row } from '@shared/grid'
import { Size } from '@iam/theme'
import { useTheme } from '@shared/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'

type Props = {
	likeCount?: number
	liked?: boolean
	commentCount?: number
	expanded?: boolean
	isAuthenticated: boolean
	onToggleLike: () => void
	onToggleComments: () => void
	disabledComment?: boolean
}

export const FeedbackBar: React.FC<Props> = ({
	likeCount,
	liked,
	commentCount,
	expanded = false,
	isAuthenticated,
	onToggleLike,
	onToggleComments,
	disabledComment = false,
}) => {
    const { theme } = useTheme()
    const commentDisabled = disabledComment || !isAuthenticated
    const textColor = (!isAuthenticated || commentDisabled) ? theme.colors.textSecondary : theme.colors.text
    const showLikes = likeCount !== undefined
    const showComments = commentCount !== undefined
	return (
		<Row
            spacing={Size.M}
            align='center'
            // paddingVertical={Size.S}
        >
            {showLikes && (
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
                            <Ionicons
                                name={liked ? 'heart' : 'heart-outline'}
                                size={20}
                                color={liked ? 'red' : textColor}
                            />                      
                        )}
                    </Row>
                </Pressable>
            )}

            {showLikes && showComments && <View style={{ width: 2, backgroundColor: '#ccc' }}>&nbsp;</View>}

			{showComments && (
                <Pressable
                    onPress={onToggleComments}
                    disabled={commentDisabled}
                >
                    <Row spacing={5} align='center'>
                        {commentCount > 0 ? (
                            <Text style={[styles.bottomButton, { color: textColor }]}>
                                {`${commentCount} Comment${commentCount !== 1 ? 's' : ''}`}
                            </Text>
                        ) : (
                            <Text style={[styles.bottomButton, { color: textColor }]}>
                                Add comment
                            </Text>
                        )}

                        {commentCount > 0 && (
                            <Ionicons
                                name={`chevron-${expanded ? 'up' : 'down' }`}
                                size={16}
                                color={textColor}
                                style={{ marginTop: 3 }}
                            />
                        )}
                    </Row>
                </Pressable>
            )}
		</Row>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 48,
	},
	bottomButton: {
		fontSize: 16,
        fontWeight: 500,
	},
})

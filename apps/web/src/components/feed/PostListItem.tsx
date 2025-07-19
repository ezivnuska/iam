// apps/web/src/components/PostListItem.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import {
    AutoSizeImage,
    Avatar,
    Column,
    IconButton,
    LinkPreview,
    Row,
    LikeCommentBarContainer,
} from '@/components'
import type { PartialUser, Post } from '@iam/types'
import { RefType } from '@iam/types'
import { paddingHorizontal, resolveResponsiveProp, Size } from '@iam/theme'
import Autolink from 'react-native-autolink'
import { formatRelative } from 'date-fns'
import { useAuth, usePosts, useTheme } from '@/hooks'
import { navigate } from '@/navigation'
import { normalizeUser } from '@utils'

type Props = {
	post: Post
	showPreview: boolean
	onPostDeleted?: (postId: string) => void
	onCommentDeleted?: () => void
}

export const PostListItem: React.FC<Props> = ({
	post,
	showPreview,
	onPostDeleted,
	onCommentDeleted,
}) => {
	const { user, isAuthenticated } = useAuth()
	const { deletePost } = usePosts()
	const { theme } = useTheme()

	const author = normalizeUser(post.author)
	const isAuthor = user?.id === author.id

    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 24, lg: 24 })

	const handleDelete = async () => {
		await deletePost(post._id)
		onPostDeleted?.(post._id)
	}

    const handleUserPress = () => {
        if (isAuthor) {
            navigate('Profile')
        } else {
            navigate('Users', {
                screen: 'UserProfile',
                params: { username: author.username as string },
            })
        }
		// navigate('UserProfile', { username: author.username as string })
	}

	const renderHeader = () => (
        <Pressable
            onPress={handleUserPress}
        >
            <Row
                spacing={Size.M}
                align='center'
            >
                <Avatar user={post.author as PartialUser} size='md' />
                <Column flex={1}>
                    <Text
                        style={[
                            styles.username,
                            { color: theme.colors.text },
                        ]}
                    >
                        {post.author.username}
                    </Text>
                    <Text
                        style={[
                            styles.date,
                            { color: theme.colors.textSecondary },
                        ]}
                    >
                        {formatRelative(new Date(post.createdAt), new Date())}
                    </Text>
                </Column>
                {isAuthenticated && isAuthor && (
                    <IconButton
                        onPress={handleDelete}
                        iconName='trash-outline'
                        iconSize={iconSize}
                    />
                )}
            </Row>
        </Pressable>
	)

	return (
		<Column
            spacing={Size.M} 
            paddingHorizontal={paddingHorizontal}
            style={{ marginBottom: Size.M }}
        >
			{renderHeader()}

			<Autolink
				text={post.content}
				style={{ fontSize: 16, color: theme.colors.text }}
				linkStyle={{ color: theme.colors.link }}
				url
				email={false}
				phone={false}
				truncate={50}
				truncateChars='...'
			/>

			{post.image && <AutoSizeImage image={post.image} />}

			{showPreview && post.linkUrl && post.linkPreview && (
				<LinkPreview url={post.linkUrl} preview={post.linkPreview} />
			)}

			<LikeCommentBarContainer
				refId={post._id}
				refType={RefType.Post}
				onCommentDeleted={onCommentDeleted}
			/>
		</Column>
	)
}

const styles = StyleSheet.create({
	username: {
		fontSize: 20,
		fontWeight: 'bold',
		lineHeight: 22,
	},
	date: {
		fontSize: 14,
		lineHeight: 16,
	},
})
